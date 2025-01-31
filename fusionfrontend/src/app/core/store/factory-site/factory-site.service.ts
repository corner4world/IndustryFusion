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
import { FactorySite } from './factory-site.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID } from '@datorama/akita';
import { FactorySiteStore } from './factory-site.store';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactorySiteService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private factorySiteStore: FactorySiteStore, private http: HttpClient) { }

  getFactorySitesWithoutShiftSettings(companyId: ID): Observable<FactorySite[]> {
    return this.getFactorySites(companyId, false);
  }

  getFactorySitesWithShiftSettings(companyId: ID, refresh: boolean): Observable<FactorySite[]> {
    if (refresh) {
      this.factorySiteStore.invalidateCacheParentId(companyId);
    }
    return this.getFactorySites(companyId, true);
  }

  private getFactorySites(companyId: ID, embedChildren: boolean): Observable<FactorySite[]> {
    const path = `companies/${companyId}/factorysites?embedChildren=${embedChildren}`;
    return this.factorySiteStore.cachedByParentId(companyId,
      this.http.get<FactorySite[]>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions)
        .pipe(tap(entities => {
          this.factorySiteStore.upsertManyByParentIdCached(companyId, entities);
        })));
  }

  getFactorySiteWithoutShiftSettings(companyId: ID, factorySiteId: ID, refresh: boolean = false): Observable<FactorySite> {
    return this.getFactorySite(companyId, factorySiteId, refresh, false);
  }

  getFactorySiteWithShiftsSettings(companyId: ID, factorySiteId: ID): Observable<FactorySite> {
    return this.getFactorySite(companyId, factorySiteId, true, true);
  }

  private getFactorySite(companyId: ID, factorySiteId: ID, refresh: boolean, embedChildren: boolean): Observable<FactorySite> {
    const path = `companies/${companyId}/factorysites/${factorySiteId}?embedChildren=${embedChildren}`;
    if (refresh) {
      this.factorySiteStore.invalidateCacheId(factorySiteId);
    }

    return this.factorySiteStore.cachedById(factorySiteId,
      this.http.get<FactorySite>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions)
        .pipe(tap(entity => {
          this.factorySiteStore.upsertCached(entity);
        })));
  }

  createFactorySite(factorySite: FactorySite): Observable<FactorySite> {
    const path = `companies/${factorySite.companyId}/factorysites`;
    return this.http.post<FactorySite>(`${environment.apiUrlPrefix}/${path}`, factorySite, this.httpOptions)
      .pipe(tap(entity => {
        this.factorySiteStore.upsertCached(entity);
      }));
  }

  initFactorySiteDraft(companyId: ID): Observable<FactorySite> {
    const path = `companies/${companyId}/factorysites/init-factory-site-draft`;
    return this.http.get<FactorySite>(`${environment.apiUrlPrefix}/${path}`, this.httpOptions);
  }

  updateFactorySite(factorySite: FactorySite): Observable<FactorySite> {
    const path = `companies/${factorySite.companyId}/factorysites/${factorySite.id}`;
    return this.http.patch<FactorySite>(`${environment.apiUrlPrefix}/${path}`, factorySite, this.httpOptions)
      .pipe(tap(entity => {
        this.factorySiteStore.upsertCached(entity);
      }));
  }

  setActive(factorySiteId: ID) {
    this.factorySiteStore.setActive(factorySiteId);
  }
}
