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

import { AssetTypeTemplatePageComponent } from './components/pages/asset-type-template-page/asset-type-template-page.component';
import { AssetTypeTemplateListComponent } from './components/content/asset-type-template/asset-type-template-list/asset-type-template-list.component';
import { AssetTypesPageComponent } from './components/pages/asset-types-page/asset-types-page.component';
import { FieldsPageComponent } from './components/pages/fields-page/fields-page.component';
import { QuantityTypesPageComponent } from './components/pages/quantity-types-page/quantity-types-page.component';
import { UnitsPageComponent } from './components/pages/units-page/units-page.component';
import { AssetTypeTemplatesResolver } from '../core/resolvers/asset-type-templates.resolver';
import { AssetTypesResolver } from '../core/resolvers/asset-types.resolver';
import { AssetTypeListComponent } from './components/content/asset-type-list/asset-type-list.component';
import { FieldListComponent } from './components/content/field-list/field-list.component';
import { FieldsResolver } from '../core/resolvers/fields-resolver';
import { QuantityTypesResolver } from '../core/resolvers/quantity-types.resolver';
import { QuantityTypeListComponent } from './components/content/quantity-type-list/quantity-type-list.component';
import { UnitsResolver } from '../core/resolvers/units.resolver';
import { UnitListComponent } from './components/content/unit-list/unit-list.component';
import { MainAuthGuard } from '../core/guards/main-auth.guard';
import { Role } from '../core/models/roles.model';
import { AssetTypePageComponent } from './components/pages/asset-type-page/asset-type-page.component';
import { AssetTypeDetailsResolver } from '../core/resolvers/asset-type-details.resolver';
import { QuantityTypePageComponent } from './components/pages/quantity-type-page/quantity-type-page.component';
import { UnitPageComponent } from './components/pages/unit-page/unit-page.component';
import { FieldPageComponent } from './components/pages/field-page/field-page.component';
import { AssetTypeTemplatesPageComponent } from './components/pages/asset-type-templates-page/asset-type-templates-page.component';
import { AssetTypeTemplateQuery } from '../core/store/asset-type-template/asset-type-template.query';
import { AssetTypeQuery } from '../core/store/asset-type/asset-type.query';
import { FieldQuery } from '../core/store/field/field.query';
import { QuantityTypeQuery } from '../core/store/quantity-type/quantity-type.query';
import { UnitQuery } from '../core/store/unit/unit.query';
import { EcosystemBreadCrumbs } from './ecosystem-routing.model';

const routes: Routes = [
  {
    path: 'ecosystemmanager/assettypes',
    component: AssetTypesPageComponent,
    canActivate: [MainAuthGuard],
    resolve: {
      assetTypes: AssetTypeDetailsResolver,
    },
    data: {
      roles: [Role.ECOSYSTEM_MANAGER],
      breadcrumb: EcosystemBreadCrumbs.ASSET_TYPES,
    },
    children: [
      {
        path: '',
        component: AssetTypeListComponent,
        data: {
          breadcrumb: null,
        }
      },
      {
        path: ':assettypeId',
        component: AssetTypePageComponent,
        canActivate: [MainAuthGuard],
        resolve: {
          assetTypes: AssetTypesResolver,
          templates: AssetTypeTemplatesResolver,
        },
        data: {
          roles: [Role.ECOSYSTEM_MANAGER],
          breadcrumb: AssetTypeQuery,
        },
        children: [{
          path: '',
          component: AssetTypeTemplateListComponent,
          data: {
            breadcrumb: null,
          }
        }]
      }]
  },
  {
    path: 'ecosystemmanager/assettypetemplate',
    component: AssetTypeTemplatesPageComponent,
    canActivate: [MainAuthGuard],
    resolve: {
      templates: AssetTypeTemplatesResolver,
    },
    data: {
      roles: [Role.ECOSYSTEM_MANAGER],
      breadcrumb: EcosystemBreadCrumbs.ASSET_TYPE_TEMPLATES,
    },
    children: [
      {
        path: '',
        component: AssetTypeTemplateListComponent,
        data: {
          breadcrumb: null,
        }
      },
      {
        path: ':assetTypeTemplateId',
        component: AssetTypeTemplatePageComponent,
        resolve: {
          assetTypes: AssetTypesResolver,
          fields: FieldsResolver,
          units: UnitsResolver,
        },
        data: {
          roles: [Role.ECOSYSTEM_MANAGER],
          breadcrumb: AssetTypeTemplateQuery,
        },
      }
    ],
  },
  {
    path: 'ecosystemmanager/fields',
    component: FieldsPageComponent,
    canActivate: [MainAuthGuard],
    resolve: {
      fields: FieldsResolver,
      units: UnitsResolver,
      quantityTypes: QuantityTypesResolver,
    },
    data: {
      roles: [Role.ECOSYSTEM_MANAGER],
      breadcrumb: EcosystemBreadCrumbs.METRICS_AND_ATTRIBUTES,
    },
    children: [
      {
        path: '',
        component: FieldListComponent,
        data: {
          breadcrumb: null,
        }
      },
      {
        path: ':fieldId',
        component: FieldPageComponent,
        canActivate: [MainAuthGuard],
        resolve: {
          fields: FieldsResolver,
          units: UnitsResolver,
          quantityTypes: QuantityTypesResolver,
        },
        data: {
          roles: [Role.ECOSYSTEM_MANAGER],
          breadcrumb: FieldQuery,
        }
      }]
  },
  {
    path: 'ecosystemmanager/quantitytypes',
    component: QuantityTypesPageComponent,
    canActivate: [MainAuthGuard],
    resolve: {
      quantityTypes: QuantityTypesResolver,
      units: UnitsResolver,
    },
    data: {
      roles: [Role.ECOSYSTEM_MANAGER],
      breadcrumb: EcosystemBreadCrumbs.QUANTITY_TYPES,
    },
    children: [
      {
        path: '',
        component: QuantityTypeListComponent,
        data: {
          breadcrumb: null,
        }
      },
      {
        path: ':quantitytypeId',
        component: QuantityTypePageComponent,
        canActivate: [MainAuthGuard],
        resolve: {
          quantityTypes: QuantityTypesResolver,
          units: UnitsResolver,
        },
        data: {
          roles: [Role.ECOSYSTEM_MANAGER],
          breadcrumb: QuantityTypeQuery,
        },
        children: [{
          path: '',
          component: UnitListComponent,
          data: {
            breadcrumb: null,
          }
        }]
      }]
  },
  {
    path: 'ecosystemmanager/units',
    component: UnitsPageComponent,
    canActivate: [MainAuthGuard],
    resolve: {
      quantityTypes: QuantityTypesResolver,
      units: UnitsResolver,
    },
    data: {
      roles: [Role.ECOSYSTEM_MANAGER],
      breadcrumb: EcosystemBreadCrumbs.UNITS
    },
    children: [
      {
        path: '',
        component: UnitListComponent,
        data: {
          breadcrumb: null
        }
      },
      {
        path: ':unitId',
        component: UnitPageComponent,
        canActivate: [MainAuthGuard],
        resolve: {
          quantityTypes: QuantityTypesResolver,
          units: UnitsResolver,
        },
        data: {
          roles: [Role.ECOSYSTEM_MANAGER],
          breadcrumb: UnitQuery,
        },
      }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcosystemRoutingModule {
}
