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

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FactoryAssetDetailsWithFields } from 'src/app/core/store/factory-asset-details/factory-asset-details.model';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { AssetType } from 'src/app/core/store/asset-type/asset-type.model';
import { FactorySite } from 'src/app/core/store/factory-site/factory-site.model';
import { Company } from 'src/app/core/store/company/company.model';
import { FilterOption, FilterType } from '../../../../shared/components/ui/table-filter/filter-options';
import { SortEvent, TreeNode } from 'primeng/api';
import { OispAlert, OispAlertPriority } from 'src/app/core/store/oisp/oisp-alert/oisp-alert.model';
import { faExclamationCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ID } from '@datorama/akita';
import {
  AssetMaintenanceUtils,
  AssetMaintenanceUtils as Utils,
  MaintenanceType
} from '../../../../factory/util/asset-maintenance-utils';
import { TableHelper } from '../../../../core/helpers/table-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Field, FieldOption } from '../../../../core/store/field/field.model';
import { GroupByHelper, RowGroupCount } from '../../../../core/helpers/group-by-helper';


@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss']
})
export class MaintenanceListComponent implements OnInit, OnChanges {

  @Input()
  factoryAssetDetailsWithFields: FactoryAssetDetailsWithFields[];
  @Input()
  factorySites: FactorySite[];
  @Input()
  companies: Company[];
  @Input()
  assetTypes: AssetType[];
  @Input()
  fields: Field[];

  rowsPerPageOptions: number[] = TableHelper.rowsPerPageOptions;
  rowCount = TableHelper.defaultRowCount;

  displayedFactoryAssets: Array<FactoryAssetDetailsWithFields> = [];
  searchedFactoryAssets: Array<FactoryAssetDetailsWithFields> = [];
  filteredFactoryAssets: Array<FactoryAssetDetailsWithFields> = [];
  treeData: Array<TreeNode<FactoryAssetDetailsWithFields>> = [];
  searchText = '';
  groupByActive = false;
  selectedEnum: FieldOption;
  selectedEnumOptions: FieldOption[];
  rowGroupMetaDataMap: Map<ID, RowGroupCount>;
  GroupByHelper = GroupByHelper;

  faChevronCircleDown = faChevronCircleDown;
  faChevronCircleUp = faChevronCircleUp;
  faInfoCircle = faInfoCircle;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  OispPriority = OispAlertPriority;

  tableFilters: FilterOption[] =
    [{ filterType: FilterType.DROPDOWNFILTER, columnName: this.translate.instant('APP.COMMON.TERMS.ASSET_TYPE'), attributeToBeFiltered: 'category' },
    { filterType: FilterType.DROPDOWNFILTER, columnName: this.translate.instant('APP.COMMON.TERMS.MANUFACTURER'), attributeToBeFiltered: 'manufacturer' },
    { filterType: FilterType.DROPDOWNFILTER, columnName: this.translate.instant('APP.COMMON.TERMS.FACTORY'), attributeToBeFiltered: 'factorySiteName'},
    { filterType: FilterType.NUMBERBASEDFILTER, columnName: this.translate.instant('APP.COMMON.TERMS.MAINTENANCE_DUE'),
      attributeToBeFiltered: 'maintenanceDue'}];

  utils = Utils;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.rowCount = TableHelper.getValidRowCountFromUrl(this.rowCount, this.activatedRoute.snapshot, this.router);
  }

  ngOnChanges(): void {
    this.displayedFactoryAssets = this.searchedFactoryAssets = this.filteredFactoryAssets = this.factoryAssetDetailsWithFields;
    this.updateTree();
  }

  searchAssets(factoryAssetsSearchedByName: Array<FactoryAssetDetailsWithFields>) {
    this.searchedFactoryAssets = factoryAssetsSearchedByName;
    this.updateDisplayedAssets();
  }

  setSearchText(searchText: string) {
    this.searchText = searchText;
  }

  filterAssets(filteredFactoryAssets: Array<FactoryAssetDetailsWithFields>) {
    this.filteredFactoryAssets = filteredFactoryAssets;
    this.updateDisplayedAssets();
  }

  groupAssets(selectedFieldOption: FieldOption) {
    this.selectedEnum = selectedFieldOption;
    this.groupByActive = this.selectedEnum !== null;
    if (this.selectedEnum) {
      this.selectedEnumOptions = this.fields.filter(field => field.id === this.selectedEnum.fieldId).pop().enumOptions;
      this.rowGroupMetaDataMap = GroupByHelper.updateRowGroupMetaData(this.displayedFactoryAssets, this.selectedEnum);
    }
  }

  hasSelectedEnumValue(asset: FactoryAssetDetailsWithFields): number {
    return GroupByHelper.getFieldIndexOfSelectedEnum(asset, this.selectedEnum);
  }

  updateDisplayedAssets() {
    this.displayedFactoryAssets = this.factoryAssetDetailsWithFields;
    this.displayedFactoryAssets = this.searchedFactoryAssets.filter(asset => this.filteredFactoryAssets.includes(asset));
    this.updateTree();
    if (this.selectedEnum) {
      this.rowGroupMetaDataMap = GroupByHelper.updateRowGroupMetaData(this.displayedFactoryAssets, this.selectedEnum);
    }
  }

  public getMaxOpenAlertPriority(node: TreeNode<FactoryAssetDetailsWithFields>): OispAlertPriority {
    let openAlertPriority = node.data?.openAlertPriority;
    if (!node.expanded && node.children?.length > 0) {
      for (const child of node.children) {
        const childMaxOpenAlertPriority: OispAlertPriority = this.getMaxOpenAlertPriority(child);
        if (!openAlertPriority ||
          OispAlert.getPriorityAsNumber(openAlertPriority) > OispAlert.getPriorityAsNumber(childMaxOpenAlertPriority)) {
          openAlertPriority = childMaxOpenAlertPriority;
        }
      }
    }
    return openAlertPriority;
  }

  isLastChildElement(rowNode: any): boolean {
    const subsystemIds = rowNode.parent?.data.subsystemIds;
    if (subsystemIds) {
      const index = subsystemIds.findIndex((value) => value === rowNode.node.data.id);
      return index === subsystemIds.length - 1;
    } else {
      return false;
    }
  }

  openNode(node: TreeNode) {
    node.expanded = !node.expanded;
    this.treeData = [...this.treeData];
  }

  public isMaintenanceNeededSoonForAsset(asset: FactoryAssetDetailsWithFields) {
    return this.isMaintenanceNeededSoonForMaintenanceType(asset, AssetMaintenanceUtils.maintenanceHours)
      || this.isMaintenanceNeededSoonForMaintenanceType(asset, AssetMaintenanceUtils.maintenanceDays);
  }

  public isMaintenanceNeededSoon(node: TreeNode): boolean {
    const asset = node.data;
    return this.isMaintenanceNeededSoonForMaintenanceType(asset, AssetMaintenanceUtils.maintenanceHours)
      || this.isMaintenanceNeededSoonForMaintenanceType(asset, AssetMaintenanceUtils.maintenanceDays);
  }

  public isChildrenMaintenanceNeededSoon(node: TreeNode): boolean {
    let result = false;
    if (node.children?.length > 0) {
      for (const child of node.children) {
        result = result || this.isMaintenanceNeededSoon(child);
        result = result || this.isChildrenMaintenanceNeededSoon(child);
      }
    }
    return result;
  }

  private isMaintenanceNeededSoonForMaintenanceType(asset: FactoryAssetDetailsWithFields, type: MaintenanceType) {
    const maintenanceValue = Utils.getMaintenanceValue(asset, type);
    return (!isNaN(maintenanceValue) && maintenanceValue < type.lowerThreshold);
  }

  private updateTree() {
    if (this.displayedFactoryAssets) {
      const expandedNodeIDs = this.getExpandedNodeIDs(this.treeData);
      const subsystemIDs = this.displayedFactoryAssets.map(asset => asset.subsystemIds);
      const flattenedSubsystemIDs = subsystemIDs.reduce((acc, val) => acc.concat(val), []);
      const treeData: TreeNode<FactoryAssetDetailsWithFields>[] = [];
      this.displayedFactoryAssets
        .filter(asset => !flattenedSubsystemIDs.includes(asset.id))
        .forEach((value: FactoryAssetDetailsWithFields) => {
          treeData.push(this.addNode(null, value, expandedNodeIDs));
        });
      this.treeData = treeData;
    }
  }

  private getExpandedNodeIDs(treeData: TreeNode[]): ID[] {
    const expanded: ID[] = [];
    for (const node of treeData) {
      if (node.expanded) {
        expanded.push(node.data.id);
        expanded.push(...this.getExpandedNodeIDs(node.children));
      }
    }
    return expanded;
  }

  private addNode(parent: TreeNode<FactoryAssetDetailsWithFields>,
                  value: FactoryAssetDetailsWithFields, expandedNodeIDs: ID[]): TreeNode<FactoryAssetDetailsWithFields> {
    const treeNode: TreeNode<FactoryAssetDetailsWithFields> = {
      expanded: expandedNodeIDs.includes(value.id),
      data: value,
      parent,
    };
    if (value.subsystemIds?.length > 0) {
      const children: TreeNode<FactoryAssetDetailsWithFields>[] = [];
      value.subsystemIds.forEach(id => {
        const subsytem = this.factoryAssetDetailsWithFields.find(asset => asset.id === id);
        if (subsytem) {
          children.push(this.addNode(treeNode, subsytem, expandedNodeIDs));
        }
      });
      treeNode.children = children;
    }
    return treeNode;
  }

  updateRowCountInUrl(rowCount: number): void {
    TableHelper.updateRowCountInUrl(rowCount, this.router);
  }

  customSort(event: SortEvent) {
    const daysTillMaintenace = 'daysTillMaintenance';
    const operatingHoursTillMaintenance = 'operatingHoursTillMaintenance';
    const type = (event.field === daysTillMaintenace || event.field === operatingHoursTillMaintenance) ? event.field ===
      daysTillMaintenace ? AssetMaintenanceUtils.maintenanceDays : AssetMaintenanceUtils.maintenanceHours : null;

    event.data.sort((data1, data2) => {
      let value1;
      let value2;
      let result;

      if (event.field === daysTillMaintenace || event.field === operatingHoursTillMaintenance) {
        value1 = AssetMaintenanceUtils.getMaintenanceValue(data1.data, type);
        value2 = AssetMaintenanceUtils.getMaintenanceValue(data2.data, type);
      } else {
        value1 = data1.data[event.field];
        value2 = data2.data[event.field];
      }

      if (value1 == null && value2 != null) {
        result = -1;
      }
      else if (value1 != null && value2 == null) {
        result = 1;
      }
      else if (value1 == null && value2 == null) {
        result = 0;
      }
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      }
      else if (isNaN(value1) && !isNaN(value2)) {
        result = event.order;
      }
      else if (!isNaN(value1) && isNaN(value2)) {
        result = event.order * -1;
      }
      else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return (event.order * result);
    });
  }
}
