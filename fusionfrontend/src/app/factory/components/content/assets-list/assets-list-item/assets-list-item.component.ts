import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AssetDetailsWithFields, AssetModalMode } from '../../../../../store/asset-details/asset-details.model';
import { Asset } from '../../../../../store/asset/asset.model';
import { Room } from '../../../../../store/room/room.model';
import { Location } from '../../../../../store/location/location.model';
import { AssetDetails, AssetModalType } from 'src/app/store/asset-details/asset-details.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetInstantiationComponent } from '../../asset-instantiation/asset-instantiation.component';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Location as loc  } from '@angular/common';

@Component({
  selector: 'app-assets-list-item',
  templateUrl: './assets-list-item.component.html',
  styleUrls: ['./assets-list-item.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class AssetsListItemComponent implements OnInit, OnChanges {

  @Input()
  assetWithDetailsAndFields: AssetDetailsWithFields;
  @Input()
  rooms: Room[];
  @Input()
  allRoomsOfLocations: Room[];
  @Input()
  room: Room;
  @Input()
  locations: Location[];
  @Input()
  location: Location;
  @Input()
  selected = false;
  @Output()
  assetSelected = new EventEmitter<AssetDetailsWithFields>();
  @Output()
  assetDeselected = new EventEmitter<AssetDetailsWithFields>();
  @Output()
  editAssetEvent = new EventEmitter<AssetDetails>();
  @Output()
  deleteAssetEvent = new EventEmitter<AssetDetailsWithFields>();

  showStatusCircle = false;
  roomsOfLocation: Room[];
  assetDetailsForm: FormGroup;
  ref: DynamicDialogRef;
  menuActions: MenuItem[];
  route: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private routingLocation: loc) {
      this.createDetailsAssetForm(this.formBuilder, this.assetWithDetailsAndFields);
      this.menuActions = [
        { label: 'Edit item', icon: 'pi pi-fw pi-pencil', command: (_) => { this.showEditDialog(); } },
        { label: 'Move item', icon: 'pi pw-fw pi-clone', command: (_) => { this.showEditRoomDialog(); } },
        { label: 'Delete item', icon: 'pi pw-fw pi-trash', command: (_) => { this.showDeleteDialog(); } },
      ];
  }

  ngOnInit(): void {
    this.route = this.routingLocation.path();
    this.createDetailsAssetForm(this.formBuilder, this.assetWithDetailsAndFields);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.location && this.location)) {
      this.roomsOfLocation = this.location.rooms;
    }
  }

  showEditDialog() {
    const ref = this.dialogService.open(AssetInstantiationComponent, {
      data: {
        assetDetailsForm: this.assetDetailsForm,
        assetToBeEdited: this.assetWithDetailsAndFields,
        locations: this.locations,
        location: this.location,
        rooms: this.rooms,
        activeModalType: AssetModalType.customizeAsset,
        activeModalMode: AssetModalMode.editAssetMode
      },
      header: 'Assign name and description to asset',
      contentStyle: { 'padding-top': '1.5%' }
    });

    ref.onClose.subscribe((assetFormValues: AssetDetails) => {
      if (assetFormValues) {
        this.editAssetEvent.emit(assetFormValues);
      }
    });
  }

  showEditRoomDialog() {
    const ref = this.dialogService.open(AssetInstantiationComponent, {
      data: {
        assetDetailsForm: this.assetDetailsForm,
        assetToBeEdited: this.assetWithDetailsAndFields,
        locations: this.locations,
        location: this.location,
        rooms: this.rooms,
        editRoomMode: true,
        activeModalType: AssetModalType.roomAssignment,
        activeModalMode: AssetModalMode.editRoomForAssetMode
      },
      header: 'Assign asset to room',
      contentStyle: { 'padding-top': '1.5%' }
    });

    ref.onClose.subscribe((assetFormValues: AssetDetails) => {
      if (assetFormValues) {
        this.editAssetEvent.emit(assetFormValues);
      }
    });
  }

  createDetailsAssetForm(formBuilder: FormBuilder, assetWithDetailsAndFields: AssetDetailsWithFields) {
    const requiredTextValidator = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
    this.assetDetailsForm = formBuilder.group({
      id: [null],
      roomId: ['', requiredTextValidator],
      name: ['', requiredTextValidator],
      description: [''],
      imageKey: [''],
      manufacturer: ['', requiredTextValidator],
      assetSeriesName: ['', requiredTextValidator],
      category: ['', requiredTextValidator],
      roomName: ['', requiredTextValidator],
      locationName: ['', requiredTextValidator]
    });
    this.assetDetailsForm.patchValue(assetWithDetailsAndFields);
  }

  select() {
    !this.selected ? this.assetSelected.emit(this.assetWithDetailsAndFields) : this.assetDeselected.emit(this.assetWithDetailsAndFields);
  }

  getAssetLink(asset: Asset) {
    if (this.route.endsWith('assets')) {
      return [asset.id];
    } else {
      return ['assets', asset.id];
    }
  }

  showDeleteDialog() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the asset ' + this.assetWithDetailsAndFields.name + '?',
      header: 'Delete Asset Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDeleteClick();
      },
      reject: () => {
      }
    });
  }

  onDeleteClick() {
    this.deleteAssetEvent.emit(this.assetWithDetailsAndFields);
  }
}
