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
import { Metric } from '../metric/metric.model';

export class FieldTarget extends BaseEntity {
  assetTypeTemplateId: ID;
  fieldId: ID;
  field: Metric;
  fieldType: FieldType;
  mandatory: boolean;
  label: string;
  name: string;
  description: string;
}

export enum FieldType {
  ATTRIBUTE = 'ATTRIBUTE',
  METRIC = 'METRIC'
}
