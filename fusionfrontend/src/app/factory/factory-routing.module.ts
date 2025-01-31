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
import { FactorySitesPageComponent } from './components/pages/factory-sites-page/factory-sites-page.component';
import { FactorySitePageComponent } from './components/pages/factory-site-page/factory-site-page.component';
import { AssetsGridPageComponent } from './components/pages/assets-grid-page/assets-grid-page.component';
import { RoomsPageComponent } from './components/pages/rooms-page/rooms-page.component';
import { AssetsListPageComponent } from './components/pages/assets-list-page/assets-list-page.component';
import { FactoryManagerBreadCrumbs, FactoryManagerPageType } from './factory-routing.model';
import { MainAuthGuard } from '../core/guards/main-auth.guard';
import { Role } from '../core/models/roles.model';
import { AssetDigitalNameplateComponent } from './components/pages/asset-details/asset-digital-nameplate/asset-digital-nameplate.component';
import { AssetSubsystemsComponent } from './components/pages/asset-details/asset-subsystems/asset-subsystems.component';
import { FactoryAssetDetailsResolver } from '../core/resolvers/factory-asset-details.resolver';
import { OispDeviceResolver } from '../core/resolvers/oisp-device-resolver';
import { AssetAppletsComponent } from './components/pages/asset-details/asset-applets/asset-applets.component';
import { AssetNotificationsComponent } from './components/pages/asset-details/asset-notifications/asset-notifications.component';
import { OispRuleFilteredByStatusResolver } from '../core/resolvers/oisp-rule-filtered-by-status.resolver';
import { FactorySiteQuery } from '../core/store/factory-site/factory-site.query';
import { FactorySitesComponent } from './components/content/factory-sites/factory-sites.component';
import { RoomQuery } from '../core/store/room/room.query';
import { RoomsListComponent } from './components/content/rooms-list/rooms-list.component';
import { FactoryAssetDetailsQuery } from '../core/store/factory-asset-details/factory-asset-details.query';
import { AssetPerformanceComponent } from './components/pages/asset-details/asset-performance/asset-performance.component';
import { FieldInstanceDetailsResolver } from '../core/resolvers/field-instance-details.resolver';
import { CompanyResolver } from '../core/resolvers/company.resolver';

const routes: Routes = [
  {
    path: 'factorymanager/companies/:companyId',
    canActivate: [MainAuthGuard],
    resolve: {
      devices: OispDeviceResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'factorysites',
        pathMatch: 'full'
      },
      {
        path: 'factorysites',
        component: FactorySitesPageComponent,
        data: {
          roles: [Role.FACTORY_MANAGER],
          breadcrumb: FactoryManagerBreadCrumbs.FACTORY_SITES
        },
        resolve: {
          company: CompanyResolver
        },
        children: [
          {
            path: '',
            component: FactorySitesComponent,
            pathMatch: 'full',
            data: {
              pageTypes: [FactoryManagerPageType.FACTORY_SITE_LIST],
              breadcrumb: null
            }
          },
          {
            path: ':factorySiteId',
            pathMatch: 'full',
            component: FactorySitePageComponent,
            data: {
              pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_LIST, FactoryManagerPageType.ROOM_LIST],
              roles: [Role.FACTORY_MANAGER],
              breadcrumb: FactorySiteQuery
            },
          },
          {
            path: ':factorySiteId',
            data: {
              roles: [Role.FACTORY_MANAGER],
              breadcrumb: FactorySiteQuery
            },
            children: [
              {
                path: 'asset-cards/:assetIdList',
                component: AssetsGridPageComponent,
                data: {
                  pageTypes: [FactoryManagerPageType.FACTORY_SITE_DETAIL, FactoryManagerPageType.ASSET_CARD],
                  roles: [Role.FACTORY_MANAGER],
                  breadcrumb: FactoryManagerBreadCrumbs.ASSET_CARDS
                }
              }
            ]
          }
        ]
      }
    ]
  },

  {
    path: 'factorymanager/companies/:companyId/rooms',
    component: RoomsPageComponent,
    canActivate: [MainAuthGuard],
    data: {
      roles: [Role.FACTORY_MANAGER],
      breadcrumb: FactoryManagerBreadCrumbs.ROOMS
    },
    resolve: {
      company: CompanyResolver
    },
    children: [
      {
        path: '',
        component: RoomsListComponent,
        pathMatch: 'full',
        data: {
          pageTypes: [FactoryManagerPageType.ROOM_LIST],
          breadcrumb: null,
        }
      },
      {
        path: ':roomId',
        pathMatch: 'full',
        component: AssetsListPageComponent,
        canActivate: [MainAuthGuard],
        data: {
          pageTypes: [FactoryManagerPageType.ROOM_DETAIL, FactoryManagerPageType.ROOM_LIST],
          roles: [Role.FACTORY_MANAGER],
          breadcrumb: RoomQuery,
        }
      },
      {
        path: ':roomId',
        data: {
          roles: [Role.FACTORY_MANAGER],
          breadcrumb: RoomQuery
        },
        children: [
          {
            path: 'asset-cards/:assetIdList',
            component: AssetsGridPageComponent,
            data: {
              pageTypes: [FactoryManagerPageType.ROOM_DETAIL, FactoryManagerPageType.ASSET_CARD],
              roles: [Role.FACTORY_MANAGER],
              breadcrumb: FactoryManagerBreadCrumbs.ASSET_CARDS
            }
          }
        ]
      }
    ]
  },

  {
    path: 'factorymanager/companies/:companyId/assets',
    canActivate: [MainAuthGuard],
    resolve: {
      company: CompanyResolver,
    },
    data: {
      roles: [Role.FACTORY_MANAGER],
      breadcrumb: FactoryManagerBreadCrumbs.ASSETS,
    },
    children: [
      {
        path: '',
        component: AssetsListPageComponent,
        pathMatch: 'full',
        data: {
          pageTypes: [FactoryManagerPageType.ASSET_LIST],
          breadcrumb: null
        }
      },
      {
        path: 'status/:status',
        component: AssetsListPageComponent,
        canActivate: [MainAuthGuard],
        data: {
          pageTypes: [FactoryManagerPageType.ASSET_LIST],
          breadcrumb: null
        }
      },
      {
        path: 'asset-cards/:assetIdList',
        component: AssetsGridPageComponent,
        canActivate: [MainAuthGuard],
        data: {
          pageTypes: [FactoryManagerPageType.ASSET_LIST, FactoryManagerPageType.ASSET_CARD],
          roles: [Role.FACTORY_MANAGER],
          breadcrumb: FactoryManagerBreadCrumbs.ASSET_CARDS
        }
      },
      {
        path: ':assetId',
        canActivate: [MainAuthGuard],
        resolve: {
          assets: FactoryAssetDetailsResolver,
          fieldInstanceDetails: FieldInstanceDetailsResolver
        },
        data: {
          pageTypes: [FactoryManagerPageType.ASSET_DETAIL],
          roles: [Role.FACTORY_MANAGER],
          breadcrumb: FactoryAssetDetailsQuery
        },
        children: [
          {
            path: '',
            redirectTo: 'performance/performance',
            pathMatch: 'full',
          },
          {
            path: 'performance/realtime',
            resolve: { },
            component: AssetPerformanceComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.PERFORMANCE,
            },
          },
          {
            path: 'performance/historical',
            component: AssetPerformanceComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.PERFORMANCE,
            },
          },
          {
            path: 'performance/performance',
            component: AssetPerformanceComponent,
            resolve: { fieldInstanceDetails: FieldInstanceDetailsResolver},
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.PERFORMANCE,
            },
          },

          {
            path: 'applets/active',
            component: AssetAppletsComponent,
            resolve: { rules: OispRuleFilteredByStatusResolver },
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.ACTIVE_APPLETS,
            },
          },
          {
            path: 'applets/archiv',
            component: AssetAppletsComponent,
            resolve: { rules: OispRuleFilteredByStatusResolver },
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.ARCHIVED_APPLETS,
            },
          },

          {
            path: 'digital-nameplate',
            component: AssetDigitalNameplateComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.DIGITAL_NAMEPLATE,
            },
          },
          {
            path: 'subsystems',
            component: AssetSubsystemsComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.SUBSYSTEMS,
            },
          },
          {
            path: 'notifications/open',
            component: AssetNotificationsComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.NOTIFICATIONS,
            },
          },
          {
            path: 'notifications/cleared',
            component: AssetNotificationsComponent,
            data: {
              breadcrumb: FactoryManagerBreadCrumbs.NOTIFICATIONS,
            },
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryRoutingModule {
}
