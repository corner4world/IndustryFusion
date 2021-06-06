/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Location as loc } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AssetService } from 'src/app/store/asset/asset.service';
import { Company } from 'src/app/store/company/company.model';
import { Location } from 'src/app/store/location/location.model';
import { Room } from 'src/app/store/room/room.model';
import { AssetDetails, AssetDetailsWithFields, AssetModalType } from '../../../../store/asset-details/asset-details.model';
import { AssetDetailsService } from '../../../../store/asset-details/asset-details.service';
import { AssetSeriesDetails } from '../../../../store/asset-series-details/asset-series-details.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetWithFields } from '../../../../store/asset/asset.model';
import { AssetInstantiationComponent } from '../asset-instantiation/asset-instantiation.component';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  providers: [DialogService]
})
export class AssetsListComponent implements OnChanges {
  @Input()
  company: Company;
  @Input()
  locations: Location[];
  @Input()
  location: Location;
  @Input()
  assetSeries: AssetSeriesDetails[];
  @Input()
  assetsWithDetailsAndFields: AssetDetailsWithFields[];
  @Input()
  rooms: Room[];
  @Input()
  allRoomsOfLocation: Room[];
  @Input()
  room: Room;
  @Output()
  selectedEvent = new EventEmitter<Set<ID>>();
  @Output()
  toolBarClickEvent = new EventEmitter<string>();
  @Output()
  assetSeriesSelected = new EventEmitter<AssetSeriesDetails>();
  @Output()
  assetDetailsSelected = new EventEmitter<AssetDetails>();

  @Output()
  createAssetEvent = new EventEmitter<AssetWithFields>();
  @Output()
  updateAssetEvent = new EventEmitter<AssetWithFields>();

  asset: AssetWithFields;
  assetForm: FormGroup;
  companyId: ID;
  ref: DynamicDialogRef;


  isLoading$: Observable<boolean>;
  selectedIds: Set<ID> = new Set();
  filterDict: { [key: string]: string[]; };
  assetsRoomIds: Set<ID> = new Set<ID>();
  assetRoomNamesAndIds: Set<[string, ID]> = new Set<[string, ID]>();
  assetsCategories: Set<string> = new Set<string>();
  assetsLocations: Set<string> = new Set<string>();
  assetsManufacturers: Set<string> = new Set<string>();
  moveAssetModal = false;

  assetsMapping:
    { [k: string]: string } = { '=0': 'No assets', '=1': '# Asset', other: '# Assets' };

  editBarMapping:
    { [k: string]: string } = {
      '=0': 'No assets selected',
      '=1': '# Asset selected',
      other: '# Assets selected'
    };

  constructor(
    private assetService: AssetService,
    private assetDetailsService: AssetDetailsService,
    private routingLocation: loc,
    private formBuilder: FormBuilder,
    public dialogService: DialogService) { }

  onInit() {
    this.createAssetSeriesForm(this.formBuilder);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.rooms || changes.assetsWithDetailsAndFields) && this.assetsWithDetailsAndFields && this.rooms) {
      this.assetsWithDetailsAndFields.forEach(assetDetails => {
        this.assetsCategories.add(assetDetails.category);
        this.assetsLocations.add(assetDetails.locationName);
        this.assetsManufacturers.add(assetDetails.manufacturer);
        if (!this.containsId(assetDetails.roomId)) {
          this.assetsRoomIds.add(assetDetails.roomId);
          this.assetRoomNamesAndIds.add([assetDetails.roomName, assetDetails.roomId]);
        }
      });
    }
  }

  showCreateDialog() {
    const ref = this.dialogService.open(AssetInstantiationComponent, {
      data: {
        assetForm: this.assetForm,
        assetSeries: this.assetSeries,
        rooms: this.rooms,
        activeModalType: AssetModalType.startInitialitation
      },
    });

    ref.onClose.subscribe((asset: AssetWithFields) => {
      this.onCloseCreateDialog(asset);
      this.createAssetSeriesForm(this.formBuilder);
      this.asset = new AssetWithFields();
    });
  }

  createAssetSeriesForm(formBuilder: FormBuilder) {
    const requiredTextValidator = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
    this.assetForm = formBuilder.group({
      id: [null],
      name: ['', requiredTextValidator],
      description: [''],
      assetSeriesName: ['', requiredTextValidator],
      manufacturer: ['', requiredTextValidator],
      category: ['', requiredTextValidator],
      locationName: ['', requiredTextValidator],
      roomName: ['']
    });
  }

  containsId(roomId: ID) {
    let containsId = false;
    this.assetsRoomIds.forEach(assetsRoomId => {
      if (roomId === assetsRoomId) {
        containsId = true;
      }
    });
    return containsId;
  }

  onCloseCreateDialog(asset: AssetWithFields) {
    if (asset) {
      asset.companyId = this.companyId;
      this.assetCreated(asset);
    }
  }

  assetCreated(asset: AssetWithFields): void {
    this.createAssetEvent.emit(asset);
  }

  isSelected(id: ID) {
    return this.selectedIds.has(id);
  }

  onAssetSelect(asset: AssetDetailsWithFields) {
    this.selectedIds.add(asset.id);
    this.emitSelectEvent();
  }

  onAssetDeselect(asset: AssetDetailsWithFields) {
    this.selectedIds.delete(asset.id);
    this.emitSelectEvent();
  }

  unselect() {
    this.selectedIds.clear();
  }

  emitSelectEvent() {
    this.selectedEvent.emit(this.selectedIds);
  }

  onFilter(filterDict: { [key: string]: string[]; }) {
    this.filterDict = Object.assign({ }, filterDict);
    console.log(this.filterDict);
  }

  assignAsset(room: Room, asset: AssetDetailsWithFields) {
    if ((!this.company) || (!this.location)) { return; }
    this.assetService.assignAssetToRoom(this.company.id, this.location.id, room.id, asset.roomId, asset.id)
      .subscribe(
        nextAsset => console.log('Asset with id: ' + nextAsset.id + ' reassigned to room ' + room.name),
        error => console.log(error)
      );
    this.assetDetailsService.updateRoom(asset.id, room.id);
    this.moveAssetModal = false;
  }

  goBack() {
    this.routingLocation.back();
  }

  getRoomsLink() {
    if (this.room) {
      return ['..'];
    } else {
      return ['rooms'];
    }
  }

  onCardsViewClick() {
    this.toolBarClickEvent.emit('GRID');
  }

  forwardAssetSeriesSelected(event: AssetSeriesDetails) {
    this.assetSeriesSelected.emit(event);
  }

  forwardAssetDetails(event: AssetDetails) {
    this.assetDetailsSelected.emit(event);
  }

  deleteAsset(event: AssetDetailsWithFields) {
    this.assetService.removeCompanyAsset(event.companyId, event.id).subscribe(() => {
      this.assetsWithDetailsAndFields.splice(this.assetsWithDetailsAndFields.indexOf(event), 1);
    });
  }
}

export class FilterOptions {
  filterAttribute: string;
  filterFields: string[];
}
