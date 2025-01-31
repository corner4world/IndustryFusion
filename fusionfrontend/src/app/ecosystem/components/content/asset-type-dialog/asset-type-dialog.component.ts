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

import { Component, OnInit } from '@angular/core';
import { AssetType } from '../../../../core/store/asset-type/asset-type.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetTypeDetails } from '../../../../core/store/asset-type-details/asset-type-details.model';
import { AssetTypeService } from '../../../../core/store/asset-type/asset-type.service';
import { DialogType } from '../../../../shared/models/dialog-type.model';
import { WizardHelper } from '../../../../core/helpers/wizard-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-asset-type-dialog',
  templateUrl: './asset-type-dialog.component.html',
  styleUrls: ['./asset-type-dialog.component.scss']
})
export class AssetTypeDialogComponent implements OnInit {

  public assetTypeForm: FormGroup;
  public type: DialogType;

  public DialogType = DialogType;
  public MAX_TEXT_LENGTH = WizardHelper.MAX_TEXT_LENGTH;

  constructor(private assetTypeService: AssetTypeService,
              private formBuilder: FormBuilder,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.type = this.config.data.dialogType;
    this.createAssetTypeForm(this.config.data.assetType);
    this.assetTypeForm.get('description').setValue(this.assetTypeForm.get('description').value);
  }

  onCancel() {
    this.ref.close();
  }

  onSave() {
    if (this.assetTypeForm.valid) {
      const assetType = this.assetTypeForm.getRawValue() as AssetType;

      if (this.type === DialogType.CREATE) {
        this.assetTypeService.createItem(assetType).subscribe();
      } else if (this.type === DialogType.EDIT) {
        this.assetTypeService.editItem(assetType.id, assetType).subscribe();
      }

      this.ref.close(assetType);
    }
  }

  private createAssetTypeForm(assetTypeToEdit: AssetTypeDetails) {
    this.assetTypeForm = this.formBuilder.group({
      id: [],
      version: [],
      name: ['', WizardHelper.requiredTextValidator],
      label: ['', WizardHelper.requiredTextValidator],
      description: ['', WizardHelper.maxTextLengthValidator]
    });

    if (assetTypeToEdit) {
      this.assetTypeForm.patchValue(assetTypeToEdit);
    }
  }

}
