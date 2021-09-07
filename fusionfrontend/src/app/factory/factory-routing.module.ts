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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesPageComponent } from './components/pages/companies-page/companies-page.component';
import { CompanyPageComponent } from './components/pages/company-page/company-page.component';
import { FactorySitePageComponent } from './components/pages/factory-site-page/factory-site-page.component';
import { AssetsGridPageComponent } from './components/pages/assets-grid-page/assets-grid-page.component';
import { FactorySiteRoomsPageComponent } from './components/pages/factory-site-rooms-page/factory-site-rooms-page.component';
import { AssetsListPageComponent } from './components/pages/assets-list-page/assets-list-page.component';
import { FactoryManagerPageType } from './factory-routing.model';
import { MainAuthGuardGuard } from '../services/main-auth-guard.guard';
import { Role } from '../services/roles.model';
import { AssetPerformanceComponent } from './components/pages/asset-details/asset-performance/asset-performance.component';
import { AssetDigitalNameplateComponent } from './components/pages/asset-details/asset-digital-nameplate/asset-digital-nameplate.component';
import { AssetNotificationsComponent } from './components/pages/asset-details/asset-notifications/asset-notifications.component';

const routes: Routes = [
  {
    path: 'factorymanager/companies',
    component: CompaniesPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.COMPANY_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId',
    component: CompanyPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.COMPANY_DETAIL, FactoryManagerPageType.FACTORY_SITE_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId',
    component: FactorySitePageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets',
    component: AssetsListPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/rooms',
    component: FactorySiteRoomsPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ROOM_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/rooms/:roomId',
    component: AssetsListPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ROOM_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/rooms',
    component: FactorySiteRoomsPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ROOM_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/rooms/:roomId',
    component: AssetsListPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ROOM_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/rooms/:roomId/assets',
    component: AssetsListPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ROOM_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/rooms/:roomId/asset-cards/:assetIdList',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/assets',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/factorysites/:factorySiteId/asset-cards/:assetIdList',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/asset-cards/:assetIdList',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/rooms/:roomId/asset-cards/:assetIdList',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/:assetId',
    component: AssetPerformanceComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/:assetId/performance',
    component: AssetPerformanceComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_DETAIL],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/:assetId/digital-nameplate',
    component: AssetDigitalNameplateComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_DETAIL],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/:assetId/notifications',
    component: AssetNotificationsComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_DETAIL],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/:assetId/notifications/:state',
    component: AssetNotificationsComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.ASSET_DETAIL],
      roles: [Role.FACTORY_MANAGER]
    }
  },
  {
    path: 'factorymanager/companies/:companyId/assets/asset-cards/:assetIdList',
    component: AssetsGridPageComponent,
    canActivate: [MainAuthGuardGuard],
    data: {
      pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST],
      roles: [Role.FACTORY_MANAGER]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryRoutingModule {
}
