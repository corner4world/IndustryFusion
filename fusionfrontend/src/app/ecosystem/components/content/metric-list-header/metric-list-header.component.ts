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
import { BaseListHeaderComponent } from '../base/base-list-header/base-list-header.component';

@Component({
  selector: 'app-metric-list-header',
  templateUrl: './metric-list-header.component.html',
  styleUrls: ['./metric-list-header.component.scss']
})
export class MetricListHeaderComponent extends BaseListHeaderComponent implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
