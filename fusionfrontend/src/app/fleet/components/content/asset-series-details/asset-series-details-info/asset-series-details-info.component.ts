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

import { Component, Input, OnInit } from '@angular/core';
import { AssetSeriesDetails } from '../../../../../core/store/asset-series-details/asset-series-details.model';
import { ItemOptionsMenuType } from '../../../../../shared/components/ui/item-options-menu/item-options-menu.type';
import { CompanyQuery } from '../../../../../core/store/company/company.query';
import { ID } from '@datorama/akita';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { AssetSeriesService } from '../../../../../core/store/asset-series/asset-series.service';
import { Location } from '@angular/common';
import { AssetSeriesDetailsResolver } from '../../../../../core/resolvers/asset-series-details.resolver';
import { AssetSeriesDetailsService } from '../../../../../core/store/asset-series-details/asset-series-details.service';
import { AssetSeriesDetailMenuService } from '../../../../../core/services/menu/asset-series-detail-menu.service';
import { ImageStyleType } from 'src/app/shared/models/image-style-type.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-asset-series-details-info',
  templateUrl: './asset-series-details-info.component.html',
  styleUrls: ['./asset-series-details-info.component.scss']
})
export class AssetSeriesDetailsInfoComponent implements OnInit {

  @Input()
  assetSeries: AssetSeriesDetails;

  dropdownMenuOptions: ItemOptionsMenuType[] = [ItemOptionsMenuType.CREATE, ItemOptionsMenuType.EDIT, ItemOptionsMenuType.DELETE];
  ImageStyleType = ImageStyleType;

  constructor(private router: Router,
              private routingLocation: Location,
              private confirmationService: ConfirmationService,
              private assetSeriesDetailMenuService: AssetSeriesDetailMenuService,
              private assetSeriesService: AssetSeriesService,
              private assetSeriesDetailsService: AssetSeriesDetailsService,
              private assetSeriesDetailsResolver: AssetSeriesDetailsResolver,
              private companyQuery: CompanyQuery,
              public translate: TranslateService) {
  }

  ngOnInit() {
  }

  openCreateWizard() {
    this.assetSeriesDetailMenuService.showPrefilledCreateAssetWizardAndRefresh(this.assetSeries.id, () => { });
  }

  openEditWizard() {
    this.assetSeriesDetailMenuService.showEditWizard(this.assetSeries.id.toString(), () => {
      this.assetSeriesDetailsResolver.resolveFromComponent().subscribe();
      this.assetSeriesDetailsService.setActive(this.assetSeries.id);
    });
  }

  openDeleteDialog() {
    this.assetSeriesDetailMenuService.showDeleteDialog(this.confirmationService, 'asset-series-delete-dialog-detail',
      this.assetSeries.name, () => this.deleteAssetSeries(this.assetSeries.id));
  }

  private deleteAssetSeries(id: ID) {
    this.assetSeriesService.deleteItem(this.companyQuery.getActiveId(), id).subscribe(() => {
      const currentUrlSeparated = this.routingLocation.path().split('/');
      const newRoutingLocation = currentUrlSeparated.slice(0, currentUrlSeparated.findIndex(elem => elem === 'assetseries') + 1);
      this.router.navigateByUrl(newRoutingLocation.join('/')).catch(error => console.warn('Routing error: ', error));
    });
  }

}
