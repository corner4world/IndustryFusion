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
import { ActivatedRoute, Router } from '@angular/router';
import {
  Rule,
  RuleActionType,
  RuleResetType,
  RuleStatus,
  RuleType, SynchronizationStatus,
} from 'src/app/core/store/oisp/oisp-rule/oisp-rule.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Device } from '../../../core/store/oisp/oisp-device/oisp-device.model';
import { OispDeviceQuery } from '../../../core/store/oisp/oisp-device/oisp-device.query';
import { OispRuleService } from '../../../core/store/oisp/oisp-rule/oisp-rule.service';
import { OispRuleQuery } from '../../../core/store/oisp/oisp-rule/oisp-rule.query';
import { RouteHelpers } from '../../../core/helpers/route-helpers';

@Component({
  selector: 'app-fusion-applet-editor',
  templateUrl: './fusion-applet-editor.component.html',
  styleUrls: ['./fusion-applet-editor.component.scss']
})
export class FusionAppletEditorComponent implements OnInit {
  RuleResetType = RuleResetType;

  rule: Rule;
  ruleGroup: FormGroup;
  assets: any[];
  devices: Device[];
  isRenamingOpenByDefault: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oispRuleService: OispRuleService,
    private oispDeviceQuery: OispDeviceQuery,
    private formBuilder: FormBuilder,
    private oispRuleQuery: OispRuleQuery
  ) {
    this.loadDevices();
    this.createRuleGroup();
    const fusionAppletId = this.activatedRoute.snapshot.paramMap.get('fusionAppletId');
    const lastRouteChild = RouteHelpers.getActiveRouteLastChild(this.activatedRoute);
    this.isRenamingOpenByDefault = lastRouteChild.snapshot.url[lastRouteChild.snapshot.url.length - 1].path === 'rename';

    this.oispRuleQuery.selectEntity(fusionAppletId).subscribe(rule => {
      this.rule = JSON.parse(JSON.stringify(rule));
      this.emptyMailActionIfInDraftMode();
      this.ruleGroup.patchValue(this.rule);
      if (!this.rule.synchronizationStatus) {
        this.ruleGroup.get('synchronizationStatus').patchValue(SynchronizationStatus.NotSync);
      }
      this.oispRuleService.setActive(this.rule.id);
    });
  }

  private emptyMailActionIfInDraftMode() {
    const isSingleMailAction = this.rule.actions.length === 1 && this.rule.actions[0].type === RuleActionType.mail;
    if (this.rule.status === RuleStatus.Draft && isSingleMailAction) {
      this.rule.actions[0].type = null;
    }
  }

  private createRuleGroup() {
    this.ruleGroup = this.formBuilder.group({
      id: [],
      externalId: [],
      name: [],
      description: [],
      owner: [],
      naturalLanguage: [],
      type: [RuleType.Regular, [Validators.required]],
      resetType: [],
      priority: [],
      status: [, [Validators.required]],
      synchronizationStatus: [, [Validators.required]],
      population: [],
      actions: new FormArray([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
  }

  setResetTypeAutomatic(isAutomatic: boolean) {
    if (isAutomatic) {
      this.ruleGroup.get('resetType').setValue(RuleResetType.Automatic);
    } else {
      this.ruleGroup.get('resetType').setValue(RuleResetType.Manual);
    }
  }

  save() {
    this.rule = this.ruleGroup.getRawValue();
    this.createPopulation();
    this.oispRuleService.updateRule(this.rule.id, this.rule).subscribe(rule => {
      this.rule = rule;
      this.router.navigate([this.isRenamingOpenByDefault ? '../../..' : '../..', 'detail', this.rule.id],
        { relativeTo: this.activatedRoute });
    });
  }

  private createPopulation() {
    if (this.rule.conditions.values.length > 0) {
      const ids: string[] = [];
      this.rule.conditions.values.map(value => value.component.cid).forEach(cid => {
        const usedDevice = this.devices.find(device => device.components.filter(deviceComponent => deviceComponent.cid === cid));
        if (usedDevice && !ids.includes(usedDevice.deviceId)) {
          ids.push(usedDevice.deviceId);
        }
      });
      this.rule.population = { ids };
    }
  }

  private loadDevices() {
    this.oispDeviceQuery.selectAll()
      .subscribe(devices => {
        this.devices = devices;
      });
  }

  getAsFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }
}
