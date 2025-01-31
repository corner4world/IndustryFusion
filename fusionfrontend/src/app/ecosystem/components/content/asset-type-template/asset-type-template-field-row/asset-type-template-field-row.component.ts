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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ID } from '@datorama/akita';

import { UnitQuery } from '../../../../../core/store/unit/unit.query';
import { QuantityTypeQuery } from '../../../../../core/store/quantity-type/quantity-type.query';
import { FieldTarget, FieldType } from '../../../../../core/store/field-target/field-target.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-asset-type-template-field-row',
  templateUrl: './asset-type-template-field-row.component.html',
  styleUrls: ['./asset-type-template-field-row.component.scss']
})
export class AssetTypeTemplateFieldRowComponent implements OnInit {

  @Input() confirmed = false;
  @Input() editable = true;
  @Input() fieldType: FieldType = FieldType.METRIC;

  @Input() fieldTarget: FieldTarget;
  @Output() confirmSignal = new EventEmitter<FieldTarget>();
  @Output() editSignal = new EventEmitter<FieldTarget>();
  @Output() deleteSignal = new EventEmitter<FieldTarget>();

  public FieldType = FieldType;

  constructor(private unitQuery: UnitQuery,
              private quantityQuery: QuantityTypeQuery,
              public translate: TranslateService) { }

  ngOnInit() {
    if (!this.fieldTarget.label) {
      this.fieldTarget.name = '';
    }
    this.fieldTarget.description = this.fieldTarget.field?.description;
    this.fieldTarget.label = this.fieldTarget.field?.label;
  }

  onConfirm() {
    this.confirmed = true;
    this.confirmSignal.emit(this.fieldTarget);
  }

  onEdit() {
    this.confirmed = false;
    this.editSignal.emit(this.fieldTarget);
  }

  onDelete() {
    this.deleteSignal.emit(this.fieldTarget);
  }

  getQuantityTypeName(id: ID) {
    const unit = this.unitQuery.getEntity(id);
    const quantityType = unit?.quantityType ? unit.quantityType : this.quantityQuery.getEntity(unit?.quantityTypeId);
    if (quantityType) {
      return quantityType?.name;
    }
    return '–';
  }

  getUnitSymbol(id: ID) {
    const unit = this.unitQuery.getEntity(id);
    if (unit && unit.symbol.length > 0) {
      return unit.symbol;
    }
    return '–';
  }
}
