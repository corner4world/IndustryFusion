import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssetSeries } from '../../../../../store/asset-series/asset-series.model';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldSource } from '../../../../../store/field-source/field-source.model';
import { FieldSourceQuery } from '../../../../../store/field-source/field-source.query';
import { FieldType } from '../../../../../store/field-target/field-target.model';
import { FieldQuery } from '../../../../../store/field/field-query.service';

@Component({
  selector: 'app-asset-series-create-metrics',
  templateUrl: './asset-series-create-metrics.component.html',
  styleUrls: ['./asset-series-create-metrics.component.scss']
})
export class AssetSeriesCreateMetricsComponent implements OnInit {

  @Output() errorSignal = new EventEmitter<string>();
  @Input() assetSeries: AssetSeries;

  fieldSourcesFormArray: FormArray;
  $loading: Observable<boolean>;

  constructor(private fieldSourceQuery: FieldSourceQuery,
              private fieldQuery: FieldQuery,
              private formBuilder: FormBuilder) {
    this.$loading = this.fieldSourceQuery.selectLoading();
  }

  private createFieldSourceGroup(index: number, fieldSource: FieldSource): FormGroup {
    const group = this.formBuilder.group({
      id: [],
      index: [],
      sourceUnitName: [],
      sourceSensorLabel: [],
      accuracy: [],
      name: [],
      register: ['', [Validators.required, Validators.max(255)]],
      saved: [true, Validators.requiredTrue],
    });
    group.get('id').patchValue(fieldSource.id);
    group.get('index').patchValue(index);
    group.get('sourceUnitName').patchValue(fieldSource.sourceUnit?.name);
    group.get('sourceSensorLabel').patchValue(fieldSource.sourceSensorLabel);
    group.get('name').patchValue(fieldSource.name);
    group.get('register').patchValue(fieldSource.register);

    const field = this.fieldQuery.getEntity(fieldSource.fieldTarget.fieldId);
    group.get('accuracy').patchValue(field?.accuracy);

    return group;
  }

  ngOnInit(): void {
    this.fillTable(this.assetSeries.fieldSources);
  }

  saveValue(group: AbstractControl) {
    this.assetSeries.fieldSources[group.get('index').value].register =  group.get('register').value;
    group.get('saved').patchValue(true);
  }

  private fillTable(fieldSources: FieldSource[]) {
    this.fieldSourcesFormArray = new FormArray([]);
    for (let i = 0; i < fieldSources.length; i++) {
      if (fieldSources[i].fieldTarget.fieldType === FieldType.METRIC) {
        const formGroup = this.createFieldSourceGroup(i, fieldSources[i]);
        this.fieldSourcesFormArray.push(formGroup);
      }
    }
  }

  isEditMode(group: AbstractControl): boolean {
    return !group.get('saved').value;
  }
}
