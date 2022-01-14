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

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ID } from '@datorama/akita';
import { AssetSeriesService } from '../../../../core/store/asset-series/asset-series.service';
import { AssetSeries } from '../../../../core/store/asset-series/asset-series.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogType } from '../../../../shared/models/dialog-type.model';
import { AssetSeriesWizardStep } from './asset-series-wizard-step.model';
import { ConnectivityTypeResolver } from '../../../../core/resolvers/connectivity-type.resolver';
import { Company } from '../../../../core/store/company/company.model';
import { AssetType } from '../../../../core/store/asset-type/asset-type.model';
import { CompanyQuery } from '../../../../core/store/company/company.query';
import { AssetTypeTemplateQuery } from '../../../../core/store/asset-type-template/asset-type-template.query';
import { AssetTypeQuery } from '../../../../core/store/asset-type/asset-type.query';
import { AssetTypesResolver } from '../../../../core/resolvers/asset-types.resolver';
import { FieldsResolver } from '../../../../core/resolvers/fields-resolver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetSeriesDetailsResolver } from '../../../../core/resolvers/asset-series-details.resolver';
import { AssetSeriesDetailsQuery } from '../../../../core/store/asset-series-details/asset-series-details.query';
import { WizardHelper } from '../../../../core/helpers/wizard-helper';
import { EnumHelpers } from '../../../../core/helpers/enum-helpers';
import { ImageService } from '../../../../core/services/api/image.service';

@Component({
  selector: 'app-asset-series-wizard',
  templateUrl: './asset-series-wizard.component.html',
  styleUrls: ['./asset-series-wizard.component.scss']
})
export class AssetSeriesWizardComponent implements OnInit, OnDestroy {

  assetType: ID;
  companyId: ID;
  step: AssetSeriesWizardStep = AssetSeriesWizardStep.GENERAL_INFORMATION;
  totalSteps: number = this.enumHelpers.getIterableArray(AssetSeriesWizardStep).length;

  assetSeries: AssetSeries;
  assetSeriesForm: FormGroup;

  type: DialogType = DialogType.CREATE;
  connectivitySettingsValid: boolean;
  attributesValid: boolean;
  metricsValid: boolean;
  fieldSourcesCanBeDeleted: boolean;
  relatedManufacturer: Company;
  relatedAssetType: AssetType;

  assetSeriesImage: string = null;

  AssetSeriesCreateSteps = AssetSeriesWizardStep;

  constructor(private assetSeriesService: AssetSeriesService,
              private assetSeriesDetailsResolver: AssetSeriesDetailsResolver,
              private assetSeriesDetailsQuery: AssetSeriesDetailsQuery,
              private companyQuery: CompanyQuery,
              private assetTypeTemplateQuery: AssetTypeTemplateQuery,
              private assetTypeQuery: AssetTypeQuery,
              private assetTypesResolver: AssetTypesResolver,
              private changeDetectorRef: ChangeDetectorRef,
              private fieldsResolver: FieldsResolver,
              private formBuilder: FormBuilder,
              private enumHelpers: EnumHelpers,
              private connectivityTypeResolver: ConnectivityTypeResolver,
              private dialogConfig: DynamicDialogConfig,
              private imageService: ImageService,
              private dynamicDialogRef: DynamicDialogRef,
  ) {
    this.resolve();
    this.initFromConfigData(dialogConfig);
  }

  private resolve() {
    this.fieldsResolver.resolve().subscribe();
    this.connectivityTypeResolver.resolve().subscribe();
    this.assetTypesResolver.resolve().subscribe();
    this.assetSeriesDetailsResolver.resolveFromComponent().subscribe();
  }

  private initFromConfigData(dialogConfig: DynamicDialogConfig): void {
    this.companyId = dialogConfig.data.companyId;

    const assetSeriesId = this.dialogConfig.data.assetSeriesId;
    this.type = assetSeriesId ? DialogType.EDIT : DialogType.CREATE;

    if (this.type === DialogType.EDIT) {
      this.assetSeriesService.getAssetSeries(this.companyId, assetSeriesId)
        .subscribe(assetSeries => {
          this.updateAssetSeries(assetSeries);
          this.loadImage();
        });
    }
  }

  private loadImage() {
    if (this.assetSeries) {
      const companyId = this.companyQuery.getActiveId();
      this.imageService.getImageAsUriSchemeString(companyId, this.assetSeries.imageKey).subscribe(imageText => {
        this.assetSeriesImage = imageText;
      });
    }
  }

  ngOnInit() {
    this.createAssetSeriesFormGroup();
    this.setIfFieldSourcesCanBeDeleted();
  }

  private setIfFieldSourcesCanBeDeleted() {
    this.fieldSourcesCanBeDeleted = true;
    if (this.type === DialogType.EDIT) {
      this.assetSeriesDetailsQuery.selectAssetSeriesDetails(this.dialogConfig.data.assetSeriesId).subscribe(assetSeriesDetails => {
        this.fieldSourcesCanBeDeleted = assetSeriesDetails.assetCount < 1;
      });
    }
  }

  private createAssetSeriesFormGroup(): void {
    this.assetSeriesForm = this.formBuilder.group({
      id: [],
      version: [],
      name: ['', WizardHelper.requiredTextValidator],
      description: ['', WizardHelper.maxTextLengthValidator],
      ceCertified: [null, Validators.required],
      protectionClass: [null, WizardHelper.maxTextLengthValidator],
      handbookUrl: [null, WizardHelper.maxTextLengthValidator],
      videoUrl: [null, WizardHelper.maxTextLengthValidator],
      imageKey: [null, WizardHelper.maxTextLengthValidator],
      assetTypeTemplateId: [{ value: null, disabled: this.type === DialogType.EDIT }, Validators.required],
      companyId: [null, Validators.required],
    });

    if (this.assetSeries) {
      this.assetSeriesForm.patchValue(this.assetSeries);
    }
  }

  ngOnDestroy(): void {
    if (this.dynamicDialogRef) {
      if (this.type === DialogType.CREATE) {
        this.deleteUploadedImageIfNotDefault();
      }
      this.dynamicDialogRef.close();
    }
  }

  private deleteUploadedImageIfNotDefault() {
    if (this.assetSeriesImage) {
      const companyId = this.companyQuery.getActiveId();
      this.imageService.deleteImageIfNotDefault(companyId, this.assetSeriesForm.get('imageKey').value,
        ImageService.DEFAULT_ASSET_SERIES_IMAGE_KEY).subscribe();
    }
  }

  createAssetSeriesOfAssetTypeTemplate(assetTypeTemplateId: ID): void {
    this.assetSeriesService.initDraftFromAssetTypeTemplate(this.companyId, assetTypeTemplateId)
      .subscribe(assetSeries => this.updateAssetSeries(assetSeries));
  }

  nextStep(): void {
    if (this.step === this.totalSteps) {
      this.saveAssetSeries();
    } else {
      this.step++;
    }
  }

  back(): void {
    if (this.step === AssetSeriesWizardStep.GENERAL_INFORMATION) {
      this.dynamicDialogRef.close();
    } else {
      this.step--;
    }
  }

  isReadyForNextStep(): boolean {
    let result = true;
    switch (this.step) {
      case AssetSeriesWizardStep.GENERAL_INFORMATION:
        result = this.assetSeries?.name?.length && this.assetSeries?.name?.length !== 0 &&
          this.assetSeriesForm.get('assetTypeTemplateId')?.value != null && this.assetSeriesForm.get('name').valid;
        break;
      case AssetSeriesWizardStep.NAMEPLATE_AND_CONNECTIVITY_SETTINGS:
        result = this.connectivitySettingsValid;
        break;
      case AssetSeriesWizardStep.METRICS:
        result = this.metricsValid;
        break;
      case AssetSeriesWizardStep.ATTRIBUTES:
        result = this.attributesValid;
        break;
    }
    return result;
  }

  setConnectivitySettingsValid(isValid: boolean): void {
    this.connectivitySettingsValid = isValid;
    this.changeDetectorRef.detectChanges();
  }

  setAttributesValid(isValid: boolean): void {
    this.attributesValid = isValid;
    this.changeDetectorRef.detectChanges();
  }

  setMetricsValid(isValid: boolean): void {
    this.metricsValid = isValid;
    this.changeDetectorRef.detectChanges();
  }

  private updateAssetSeries(assetSeries: AssetSeries) {
    this.assetSeries = assetSeries;
    this.createAssetSeriesFormGroup();
    this.updateRelatedObjects(assetSeries);
  }

  private updateRelatedObjects(assetSeries: AssetSeries): void {
    this.relatedManufacturer = this.companyQuery.getActive();
    if (!this.relatedManufacturer) {
      console.warn('[Asset wizard]: No active company found');
    }

    this.assetTypeTemplateQuery.selectLoading().subscribe(isLoading => {
      if (!isLoading) {
        const assetTypeTemplate = this.assetTypeTemplateQuery.getEntity(assetSeries.assetTypeTemplateId);
        this.relatedAssetType = this.assetTypeQuery.getEntity(assetTypeTemplate.assetTypeId);
      }
    });
  }

  private updateAssetSeriesFromForm(): void {
    const updatedAssetSeries: AssetSeries = this.assetSeriesForm.getRawValue();

    updatedAssetSeries.customScript = this.assetSeries.customScript;
    updatedAssetSeries.fieldSources = this.assetSeries.fieldSources;
    updatedAssetSeries.fieldSourceIds = this.assetSeries.fieldSourceIds;

    this.assetSeries = updatedAssetSeries;
  }

  private saveAssetSeries(): void {
    this.updateAssetSeriesFromForm();

    if (this.assetSeries.id) {
      this.assetSeriesService.editItem(this.assetSeries.id, this.assetSeries).subscribe(
        () => this.closeWizardAfterSave());
    } else {
      this.assetSeriesService.createItem(this.assetSeries.companyId, this.assetSeries)
        .subscribe(() => this.closeWizardAfterSave());
    }
  }

  private closeWizardAfterSave() {
    this.dynamicDialogRef.close();
    this.dynamicDialogRef = null;
  }

  updateAssetSeriesImage(assetSeriesImage: string): void {
    if (assetSeriesImage) {
      this.assetSeriesImage = assetSeriesImage;
    }
  }
}
