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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import { KeycloakConfig } from 'keycloak-js';

export const environment = {
  production: false,
  apiUrlPrefix: 'api',
  oispApiUrlPrefix: 'https://PUT-YOUR-OISP-URL-HERE.com/v1/api',
  kairosApiUrlPrefix: 'https://PUT-YOUR-KAIROS-URL-HERE.com/api/v1',
  alertsUpdateIntervalMs: 10000,
  dataUpdateIntervalMs: 10000,
  assetStatusSampleRateMs: 5000,
  oispAuthToken: 'Not required anymore',
  weatherApiUrl: 'https://api.openweathermap.org/data/2.5/weather?',
  weatherApiKey: 'PUT-YOUR-OPENWEATHERMAP-APIKEY-HERE',
  googleMapsClientId: 'PUT-YOUR-GOOGLEMAPS-CLIENTID-HERE',
  keycloakConfig: {
    url: 'http://localhost:4200/auth',
    realm: 'OISP',
    clientId: 'fusion-frontend'
  } as KeycloakConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
