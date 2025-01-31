import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FactorySite, Shift } from '../../../../core/store/factory-site/factory-site.model';
import { Day } from '../../../../core/models/days.model';
import { TranslateService } from '@ngx-translate/core';
import { FactorySiteService } from '../../../../core/store/factory-site/factory-site.service';
import { CompanyQuery } from '../../../../core/store/company/company.query';
import { ShiftsHelper } from '../../../../core/helpers/shifts-helper';

@Component({
  selector: 'app-shifts-filter',
  templateUrl: './shifts-filter.component.html',
  styleUrls: ['./shifts-filter.component.scss']
})
export class ShiftsFilterComponent implements OnInit, OnChanges {

  @Input()
  factorySites: FactorySite[];

  @Input()
  day: Day;

  @Output()
  shiftsChanged = new EventEmitter<{ selectedShifts: Shift[], factorySite: FactorySite }>();

  factorySiteOptions: FactorySite[];
  selectedFactorySite: FactorySite;
  shiftOptions: Shift[];
  selectedShifts?: Shift[];
  subtitle: string;

  private lastAppliedShiftsSorted: Shift[];

  constructor(private translate: TranslateService,
              private companyQuery: CompanyQuery,
              private factorySiteService: FactorySiteService) {  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.day) {
      this.subtitle = this.translate.instant('APP.SHARED.UI.SHIFTS_FILTER.SHIFTS_OF_DAY_LABEL',
        { day: this.translate.instant('APP.COMMON.DAYS.' + this.day) });

      this.updateShiftOptions();
      this.onApply();
    }
    if (changes.factorySites) {
      this.clearAll();
    }
  }

  private clearAll(): void {
    this.factorySiteOptions = [];
    this.selectedFactorySite = null;
    this.shiftOptions = [];
    this.selectedShifts = null;
    this.lastAppliedShiftsSorted = null;
    this.factorySites?.forEach(factorySite => this.factorySiteOptions.push(factorySite));
  }

  onFactorySiteSelected(): void {
    if (!this.selectedFactorySite.shiftSettings) {
      this.factorySiteService.getFactorySiteWithShiftsSettings(this.companyQuery.getActiveId(), this.selectedFactorySite.id)
        .subscribe(factorySiteWithShiftSettings => {
          this.selectedFactorySite = factorySiteWithShiftSettings;
          this.updateShiftOptions();
        });
    } else {
      this.updateShiftOptions();
    }
  }

  private updateShiftOptions(): void {
    if (!this.selectedFactorySite) {
      return;
    }
    if (!this.day) {
      throw Error('[Shifts filter]: Day is not provided');
    }
    if (!this.selectedFactorySite.shiftSettings) {
      throw Error('[Shifts filter]: Shift settings are not provided. Is the correct resolver being used with shift settings?');
    }

    this.shiftOptions = [];

    const shiftsOfDay = ShiftsHelper.getActiveShiftsOfDay(this.day, this.selectedFactorySite.shiftSettings);
    if (shiftsOfDay) {
      shiftsOfDay.shifts.forEach(shift => this.shiftOptions.push(shift));
    }

    this.remainShiftsSelectedWithSameNames();
  }

  private remainShiftsSelectedWithSameNames(): void {
    if (this.selectedShifts) {
      const shiftsOfNewDayWithMatchingNames: Shift[] = [];
      const namesOfPreviousShiftsLowerCase: string[] = this.selectedShifts.map(shift => shift.name.toLowerCase());

      for (const newShiftOption of this.shiftOptions) {
        if (namesOfPreviousShiftsLowerCase.includes(newShiftOption.name.toLowerCase())) {
          shiftsOfNewDayWithMatchingNames.push(newShiftOption);
        }
      }

      this.selectedShifts = shiftsOfNewDayWithMatchingNames;
    }
  }

  onToggleShift(shift: Shift, isChecked: boolean): void {
    this.initSelectedShiftsIfNull();

    if (isChecked) {
      this.selectedShifts.push(shift);
    } else if (shift) {
      const indexArray: number = this.selectedShifts.indexOf(shift);
      this.selectedShifts.splice(indexArray, 1);
    }
  }

  private initSelectedShiftsIfNull(): void {
    if (!this.selectedShifts) {
      this.selectedShifts = [];
    }
  }

  onReset(): void {
    this.clearAll();
    this.onApply();
  }

  onApply(): void {
    if (!this.selectedShifts) {
      this.lastAppliedShiftsSorted = null;
      this.shiftsChanged.emit({ selectedShifts: [], factorySite: null });
      return;
    }

    const sortedSelectedShifts = ShiftsHelper.sortShiftsUsingInsertionOrder(this.selectedShifts);
    const isNotAlreadyApplied = !this.lastAppliedShiftsSorted ||
      !this.isArrayEqual(this.lastAppliedShiftsSorted.map(shift => shift.id), sortedSelectedShifts.map(shift => shift.id));

    if (isNotAlreadyApplied) {
      this.lastAppliedShiftsSorted = [...sortedSelectedShifts];
      this.shiftsChanged.emit({ selectedShifts: sortedSelectedShifts, factorySite: this.selectedFactorySite });
    }
  }

  private isArrayEqual(a: any[], b: any[]): boolean {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  isShiftSelected(shift: Shift): boolean {
    return this.selectedShifts != null && this.selectedShifts.includes(shift);
  }
}
