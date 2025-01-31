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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FleetAssetDetails } from './fleet-asset-details.model';
import { tap } from 'rxjs/operators';
import { FleetAssetDetailsStore } from './fleet-asset-details.store';
import { FactoryAssetDetails } from '../factory-asset-details/factory-asset-details.model';


@Injectable({
  providedIn: 'root'
})
export class FleetAssetDetailsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private fleetAssetDetailsStore: FleetAssetDetailsStore,
              private http: HttpClient) { }

  getAssetDetailsOfCompany(companyId: ID): Observable<FleetAssetDetails[]> {
    const path = `companies/${companyId}/fleetassetdetails`;
    const cacheKey = 'company-' + companyId;
    return this.fleetAssetDetailsStore.cachedByParentId(cacheKey,
      this.http.get<FleetAssetDetails[]>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions)
      .pipe(tap(entities => {
        this.fleetAssetDetailsStore.upsertManyByParentIdCached(cacheKey, entities);
      })));
  }

  getFleetAssetDetails(companyId: ID, assetDetailsId: ID): Observable<FactoryAssetDetails> {
    const path = `companies/${companyId}/fleetassetdetails/${assetDetailsId}`;
    return this.http.get<FactoryAssetDetails>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions)
      .pipe(tap(entity => {
        this.fleetAssetDetailsStore.upsertCached(entity);
      }));
  }

  getSubsystemCandidates(companyId: ID, assetSeriesId: ID): Observable<FleetAssetDetails[]> {
    const path = `companies/${companyId}/assetseries/${assetSeriesId}/subsystemcandidates`;
    return this.http.get<FleetAssetDetails[]>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions);
  }

  setActive(assetId: ID) {
    this.fleetAssetDetailsStore.setActive(assetId);
  }
}
