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

import { ID } from '@datorama/akita';

import { BaseEntity } from '../baseentity.model';
import { AssetType } from '../asset-type/asset-type.model';
import { FieldTarget } from '../field-target/field-target.model';

export class AssetTypeTemplate extends BaseEntity {
  name: string;
  description: string;
  imageKey: string;
  assetTypeId: ID;
  assetType: AssetType;
  publicationState: PublicationState;
  publishedDate: Date;
  publishedVersion: bigint;
  fieldTargetIds: Array<ID>;
  fieldTargets: Array<FieldTarget>;
  creationDate: Date;
}

export enum PublicationState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}
