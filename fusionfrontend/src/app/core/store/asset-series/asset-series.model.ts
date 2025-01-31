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
import { FieldSource } from '../field-source/field-source.model';

export class AssetSeries extends BaseEntity {
   companyId: ID;
   assetTypeTemplateId: ID;
   fieldSourceIds: Array<ID>;
   fieldSources: Array<FieldSource>;
   connectivitySettings: ConnectivitySettings;
   ceCertified: boolean;
   protectionClass: string;

   /** Key to object storage or link to an external url. */
   manualKey: string;

   /** Key to object storage or link to an external url. */
   videoKey: string;

   name: string;
   description: string;
   imageKey: string;
   customScript: string;
}

export class ConnectivitySettings extends BaseEntity {
  connectivityTypeId: ID;
  connectivityProtocolId: ID;
  connectionString: string;
}
