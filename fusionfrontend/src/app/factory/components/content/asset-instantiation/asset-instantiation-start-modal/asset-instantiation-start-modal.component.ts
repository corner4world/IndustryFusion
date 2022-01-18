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
import { ImageStyleType } from 'src/app/shared/models/image-style-type.model';
import {
  FactoryAssetDetailsWithFieldsAndImage
} from '../../../../../core/store/factory-asset-details/factory-asset-details.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-asset-instantiation-start-modal',
  templateUrl: './asset-instantiation-start-modal.component.html',
  styleUrls: ['./asset-instantiation-start-modal.component.scss']
})
export class AssetInstantiationStartModalComponent implements OnInit {

  @Input()
  assetsToBeOnboarded: FactoryAssetDetailsWithFieldsAndImage[];

  @Output()
  assetOnboardingEvent = new EventEmitter<FactoryAssetDetailsWithFieldsAndImage>();

  ImageStyleType = ImageStyleType;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

  onSubmit(assetToBeOnboarded?: FactoryAssetDetailsWithFieldsAndImage) {
    this.assetOnboardingEvent.emit(assetToBeOnboarded);
  }
}
