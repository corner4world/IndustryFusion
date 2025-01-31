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

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-control-limit-selector',
  templateUrl: './control-limit-selector.component.html',
  styleUrls: ['./control-limit-selector.component.scss']
})
export class ControlLimitSelectorComponent implements OnInit {

  @Input()
  valuesGroup: FormArray;
  limitGroup: FormGroup;

  constructor() {
   this.createFormGroup();
  }

  ngOnInit(): void {
    this.limitGroup.get('limit').setValue(this.valuesGroup.getRawValue());
  }

  private createFormGroup(): void {
    const limitControl = new FormControl(['-2', '2'], Validators.minLength(2));
    this.limitGroup = new FormGroup({ limit: limitControl});
    limitControl.valueChanges.subscribe(value => {
      this.valuesGroup.clear();
      for (let i = 0; i < value.length; i++) {
        this.valuesGroup.insert(i, new FormControl(value[i]));
      }
    });
  }

}
