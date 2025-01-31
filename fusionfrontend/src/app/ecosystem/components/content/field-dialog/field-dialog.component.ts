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

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Unit } from '../../../../core/store/unit/unit.model';
import { UnitQuery } from '../../../../core/store/unit/unit.query';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Field, FieldDataType, FieldOption, FieldThresholdType } from '../../../../core/store/field/field.model';
import { SelectItem } from 'primeng/api';
import { DialogType } from 'src/app/shared/models/dialog-type.model';
import { FieldService } from '../../../../core/store/field/field.service';
import { WizardHelper } from '../../../../core/helpers/wizard-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-field-dialog',
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.scss']
})
export class FieldDialogComponent implements OnInit, OnDestroy {

  public type: DialogType;
  public fieldForm: FormGroup;
  public units$: Observable<Unit[]>;
  public accuracyItems: SelectItem[];

  public DialogType = DialogType;
  public FieldThresholdType = FieldThresholdType;
  public MAX_TEXT_LENGTH = WizardHelper.MAX_TEXT_LENGTH;

  public dataTypes = FieldDataType;

  constructor(private unitQuery: UnitQuery,
              private formBuilder: FormBuilder,
              private fieldService: FieldService,
              public dialogRef: DynamicDialogRef,
              public config: DynamicDialogConfig,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.type = this.config.data.field === undefined ? DialogType.CREATE : DialogType.EDIT;
    this.createFieldFormGroup(this.config.data.field);

    this.units$ = this.unitQuery.selectAll();

    this.accuracyItems = [
      { label: '0', value: 0 },
      { label: '0.0', value: 1 },
      { label: '0.00', value: 2 },
      { label: '0.000', value: 3 },
      { label: '0.0000', value: 4 },
    ];
  }

  ngOnDestroy() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.fieldForm.valid) {
      const field: Field = this.fieldForm.getRawValue() as Field;
      if (field) {
        if (this.type === DialogType.EDIT) {
          this.fieldService.editItem(field.id, field).subscribe();
        } else {
          this.fieldService.createItem(field).subscribe();
        }

        this.fieldService.setActive(field.id);
        this.dialogRef.close(field);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  public deleteEnumOption(i: number): void {
    (this.fieldForm.get('enumOptions') as FormArray).removeAt(i);
    const newLength = (this.fieldForm.get('enumOptions') as FormArray).length;
    if (newLength === 0) {
      this.addEnumOption();
    }
  }

  public addEnumOption(): void {
    (this.fieldForm.get('enumOptions') as FormArray).push(this.createEnumOptionFormGroup(null));
  }

  private unitValidator = (formGroup: AbstractControl): ValidationErrors | null => {
    const chosenDataType = formGroup.get('dataType')?.value;
    if (chosenDataType !== FieldDataType.NUMERIC) {
      let error;
      (formGroup.get('enumOptions') as FormArray).controls.forEach(enumOption => {
        const enumOptionLabel = enumOption.get('optionLabel');
        const result = Validators.required(enumOptionLabel);
        error = result === null ? error : result;
      });
      return error;
    } else {
      return Validators.required(formGroup.get('unitId'));
    }
  }

  private createFieldFormGroup(field: Field) {
    this.fieldForm = this.formBuilder.group({
      id: [],
      version: [],
      name: ['', WizardHelper.requiredTextValidator],
      label: ['', WizardHelper.requiredTextValidator],
      description: ['', WizardHelper.maxTextLengthValidator],
      accuracy: [0],
      dataType: [null, Validators.required],
      unitId: [null],
      thresholdType: [FieldThresholdType.OPTIONAL, Validators.required],
      enumOptions: this.formBuilder.array(this.createEnumOptions(field))
    }, { validator: this.unitValidator });

    if (this.type === DialogType.EDIT && field) {
      this.fieldForm.patchValue(field);
    }
  }

  private createEnumOptions(field: Field): AbstractControl[] {
    const controls = [];
    if (this.type === DialogType.EDIT && field?.enumOptions?.length > 0) {
      field?.enumOptions.forEach(enumValue => {
        controls.push(this.createEnumOptionFormGroup(enumValue));
      });
      return controls;
    }
    return [this.createEnumOptionFormGroup(null)];
  }

  private createEnumOptionFormGroup(fieldOption: FieldOption): AbstractControl {
    return this.formBuilder.group({
      id: [fieldOption?.id],
      optionLabel: [fieldOption?.optionLabel],
    });
  }
}
