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

import { BaseEntity } from '../baseentity.model';
import { ID } from '@datorama/akita';
import { Threshold } from '../threshold/threshold.model';
import { FieldSource } from '../field-source/field-source.model';

export class FieldInstance extends BaseEntity{
  description: string;
  externalName: string;
  name: string;
  value: string;
  assetId: ID;
  fieldSourceId: ID;
  fieldSource: FieldSource;
  absoluteThresholdId: ID;
  absoluteThreshold: Threshold;
  idealThresholdId: ID;
  idealThreshold: Threshold;
  criticalThresholdId: ID;
  criticalThreshold: Threshold;
}
