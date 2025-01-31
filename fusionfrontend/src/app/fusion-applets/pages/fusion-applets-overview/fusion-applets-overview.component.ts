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
import { ActivatedRoute } from '@angular/router';
import { RouteHelpers } from '../../../core/helpers/route-helpers';

@Component({
  selector: 'app-fusion-applets-overview',
  templateUrl: './fusion-applets-overview.component.html',
  styleUrls: ['./fusion-applets-overview.component.scss']
})
export class FusionAppletsOverviewComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  isRouteActive(subroute: string): boolean {
   return RouteHelpers.isRouteActive(subroute, this.activatedRoute);
  }
}
