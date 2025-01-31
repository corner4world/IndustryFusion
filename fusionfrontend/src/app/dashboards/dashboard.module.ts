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
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardSubHeaderComponent } from './components/content/dashboard-sub-header/dashboard-sub-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from 'src/environments/environment';
import { MaintenancePageComponent } from 'src/app/dashboards/components/pages/maintenance-page/maintenance-page.component';
import { MaintenanceListComponent } from './components/content/maintenance-list/maintenance-list.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../shared/shared.module';
import { MaintenanceAssetSortPipe } from '../shared/pipes/maintenance-asset-sort.pipe';
import { EquipmentEfficiencyPageComponent } from './components/pages/equipment-efficiency-page/equipment-efficiency-page.component';
import { EquipmentEfficiencyListComponent } from './components/content/equipment-efficiency-list/equipment-efficiency-list.component';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { EquipmentEfficiencyOverviewComponent } from './components/content/equipment-efficiency-overview/equipment-efficiency-overview.component';
import { EquipmentEfficiencyOverviewRealtimeStatusComponent } from './components/content/equipment-efficiency-overview/equipment-efficiency-overview-realtime-status/equipment-efficiency-overview-realtime-status.component';
import { EquipmentEfficiencyOverviewDonutChartComponent } from '../shared/components/content/equipment-efficiency-overview-donut-chart/equipment-efficiency-overview-donut-chart.component';
import { GaugeChartComponent } from '../shared/components/content/gauge-chart/gauge-chart.component';

@NgModule({
  declarations: [
    DashboardSubHeaderComponent,
    MaintenancePageComponent,
    MaintenanceListComponent,
    MaintenanceAssetSortPipe,
    MaintenanceAssetSortPipe,
    EquipmentEfficiencyPageComponent,
    EquipmentEfficiencyListComponent,
    EquipmentEfficiencyOverviewComponent,
    EquipmentEfficiencyOverviewRealtimeStatusComponent,
    EquipmentEfficiencyOverviewDonutChartComponent,
    GaugeChartComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    ClarityModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsClientId
    }),
    ChartsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    TableModule,
    CalendarModule,
    ChartModule,
    TableModule,
    TreeTableModule,
    TreeModule,
  ],
  exports: [
    DashboardSubHeaderComponent,
    EquipmentEfficiencyOverviewRealtimeStatusComponent,
    EquipmentEfficiencyOverviewDonutChartComponent,
    GaugeChartComponent,
  ]
})
export class DashboardModule {
}
