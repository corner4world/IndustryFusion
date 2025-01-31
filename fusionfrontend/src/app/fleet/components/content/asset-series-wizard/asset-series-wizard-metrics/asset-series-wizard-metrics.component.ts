import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssetSeries } from '../../../../../core/store/asset-series/asset-series.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldSource } from '../../../../../core/store/field-source/field-source.model';
import { FieldType } from '../../../../../core/store/field-target/field-target.model';
import { FieldQuery } from '../../../../../core/store/field/field.query';
import { WizardHelper } from '../../../../../core/helpers/wizard-helper';

@Component({
  selector: 'app-asset-series-wizard-metrics',
  templateUrl: './asset-series-wizard-metrics.component.html',
  styleUrls: ['./asset-series-wizard-metrics.component.scss']
})
export class AssetSeriesWizardMetricsComponent implements OnInit {

  @Input() assetSeries: AssetSeries;
  @Input() fieldSourcesCanBeDeleted: boolean;
  @Output() valid = new EventEmitter<boolean>();

  fieldSourcesFormArray: FormArray;
  showNotDeletableWarning: boolean;

  constructor(private fieldQuery: FieldQuery,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.createFormArray(this.assetSeries.fieldSources);
    this.showNotDeletableWarning = !this.fieldSourcesCanBeDeleted;
  }

  private createFormArray(fieldSources: FieldSource[]): void {
    this.fieldSourcesFormArray = new FormArray([]);
    this.valid.emit(this.fieldSourcesFormArray.valid);
    this.fieldSourcesFormArray.valueChanges.subscribe(() => this.valid.emit(this.fieldSourcesFormArray.valid));

    for (let i = 0; i < fieldSources.length; i++) {
      if (fieldSources[i].fieldTarget.fieldType === FieldType.METRIC) {
        const formGroup = this.createSingleFieldSourceFormGroup(i, this.fieldSourcesFormArray.length, fieldSources[i]);
        this.fieldSourcesFormArray.push(formGroup);
      }
    }
  }

  private createSingleFieldSourceFormGroup(indexFieldSources: number,
                                           indexInArray: number,
                                           fieldSource: FieldSource): FormGroup {
    const field = this.fieldQuery.getEntity(fieldSource.fieldTarget.fieldId);
    const registerValidator = fieldSource.fieldTarget.mandatory ? WizardHelper.requiredTextValidator :  WizardHelper.maxTextLengthValidator;

    return this.formBuilder.group({
      id: [fieldSource.id],
      version: [fieldSource.version],
      indexFieldSources: [indexFieldSources],
      indexInArray: [indexInArray],
      sourceUnitName: [fieldSource.sourceUnit?.name],
      fieldName: [field.name],
      accuracy: [field.accuracy],
      name: [fieldSource.name],
      register: [fieldSource.register, registerValidator],
      mandatory: [fieldSource.fieldTarget.mandatory],
      saved: [true, Validators.requiredTrue],
    });
  }

  removeMetric(metricGroup: AbstractControl): void {
    if (this.isDeletable(metricGroup) && metricGroup instanceof FormGroup) {
      WizardHelper.removeItemFromFormAndDataArray(metricGroup,
        this.fieldSourcesFormArray, 'indexInArray',
        this.assetSeries.fieldSources, 'indexFieldSources');
    }
  }

  saveValue(group: AbstractControl): void {
    this.assetSeries.fieldSources[group.get('indexFieldSources').value].register = group.get('register').value;
    group.get('saved').patchValue(true);
  }

  isUnsaved(group: AbstractControl): boolean {
    return !group.get('saved').value;
  }

  isDeletable(metricGroup: AbstractControl): boolean {
    return metricGroup != null && metricGroup.get('mandatory').value === false && this.fieldSourcesCanBeDeleted;
  }

  hideNotDeletableWarning() {
    this.showNotDeletableWarning = false;
  }
}
