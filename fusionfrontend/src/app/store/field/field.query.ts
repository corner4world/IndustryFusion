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

import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { BaseQueryEntityCached } from '../basequerycached';
import { Field } from './field.model';
import { FieldState, FieldStore } from './field.store';

@Injectable({ providedIn: 'root' })
export class FieldQuery extends BaseQueryEntityCached<FieldState, Field> {
  constructor(protected store: FieldStore) {
    super(store);
  }

  selectFieldsOfAsset(assetId: ID): Observable<Field[]> {
    return this.selectAll({
      filterBy: entity => String(entity.assetId) === String(assetId)
    });
  }
}
