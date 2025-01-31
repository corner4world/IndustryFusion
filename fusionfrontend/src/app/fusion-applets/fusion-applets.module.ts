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
import { CommonModule } from '@angular/common';
import { FusionAppletsListComponent } from './components/fusion-applets-list/fusion-applets-list.component';
import { FusionAppletsRoutingModule } from './fusion-applets-routing.module';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from '../shared/shared.module';
import { CreateFusionAppletComponent } from './components/create-fusion-applet/create-fusion-applet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EnumHelpers } from '../core/helpers/enum-helpers';
import { FusionAppletDetailComponent } from './components/fusion-applet-detail/fusion-applet-detail.component';
import { FusionAppletPageComponent } from './pages/fusion-applet-page/fusion-applet-page.component';
import { FusionAppletsSubHeaderComponent } from './components/fusion-applets-sub-header/fusion-applets-sub-header.component';
import { FusionAppletEditorComponent } from './components/fusion-applet-editor/fusion-applet-editor.component';
import { RuleStatusUtil } from './util/rule-status-util';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppletActionComponent } from './components/fusion-applet-editor/applet-action-list/applet-action/applet-action.component';
import { AppletActionMailComponent } from './components/fusion-applet-editor/applet-action-list/applet-action/applet-action-mail/applet-action-mail.component';
import { AppletActionWebhookComponent } from './components/fusion-applet-editor/applet-action-list/applet-action/applet-action-webhook/applet-action-webhook.component';
import { AppletActionListComponent } from './components/fusion-applet-editor/applet-action-list/applet-action-list.component';
import { AppletConditionsComponent } from './components/fusion-applet-editor/applet-conditions/applet-conditions.component';
import { ConditionTimeSelectorComponent } from './components/fusion-applet-editor/applet-conditions/applet-conditions-value/condition-time-selector/condition-time-selector.component';
import { AppletConditionsValueComponent } from './components/fusion-applet-editor/applet-conditions/applet-conditions-value/applet-conditions-value.component';
import { ValidIconComponent } from './components/fusion-applet-editor/valid-icon/valid-icon.component';
import { InplaceModule } from 'primeng/inplace';
import { FleetModule } from '../fleet/fleet.module';
import { ControlLimitSelectorComponent } from './components/fusion-applet-editor/applet-conditions/applet-conditions-value/control-limit-selector/control-limit-selector.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService } from 'primeng/api';
import { FusionAppletsOverviewComponent } from './pages/fusion-applets-overview/fusion-applets-overview.component';


@NgModule({
  declarations: [
    FusionAppletsOverviewComponent,
    FusionAppletsListComponent,
    CreateFusionAppletComponent,
    FusionAppletDetailComponent,
    FusionAppletPageComponent,
    FusionAppletsSubHeaderComponent,
    FusionAppletEditorComponent,
    AppletActionComponent,
    AppletActionMailComponent,
    AppletActionWebhookComponent,
    AppletActionListComponent,
    AppletConditionsComponent,
    ConditionTimeSelectorComponent,
    AppletConditionsValueComponent,
    ValidIconComponent,
    ControlLimitSelectorComponent,
  ],
  imports: [
    CommonModule,
    FusionAppletsRoutingModule,
    TableModule,
    InputSwitchModule,
    SharedModule,
    ReactiveFormsModule,
    CardModule,
    AccordionModule,
    MultiSelectModule,
    InplaceModule,
    FleetModule,
    InputNumberModule,
  ],
  exports: [
    FusionAppletsSubHeaderComponent,
    FusionAppletsListComponent,
  ],
  providers: [
    EnumHelpers,
    RuleStatusUtil,
    ConfirmationService
  ]
})
export class FusionAppletsModule { }
