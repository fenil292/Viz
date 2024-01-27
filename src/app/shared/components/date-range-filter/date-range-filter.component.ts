import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { closest } from '@progress/kendo-angular-common';
import { DatePipe } from '@angular/common';
import { FilterService, PopupCloseEvent, SinglePopupService } from '@progress/kendo-angular-grid';
import { PopupSettings } from '@progress/kendo-angular-dateinputs';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { addDays } from '@progress/kendo-date-math';
import { Subscription } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @Input() public currentFilter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  start: Date;
  end: Date;
  popupSettings: PopupSettings = {
    popupClass: 'date-range-filter'
  };
  popupSubscription: Subscription;

  constructor(
    private datePipe: DatePipe,
    private element: ElementRef,
    private popupService: SinglePopupService) {
      // Handle the service onClose event and prevent the menu from closing when the datepickers are still active.
      this.popupSubscription = popupService.onClose.subscribe((e: PopupCloseEvent) => {
        if (
          document.activeElement &&
          closest(
            document.activeElement as HTMLElement,
            (node) => node === this.element.nativeElement || String(node.className).indexOf('date-range-filter') >= 0
          )
        ) {
          e.preventDefault();
        }
      });
  }

  ngOnInit(): void {
    const startDate = this.findValue('gte');
    const endDate = this.findValue('lte');
    this.start = startDate ? new Date(startDate) : startDate;
    this.end = endDate ? new Date(this.datePipe.transform(endDate, 'yyyy-MM-ddT00:00:00')) : endDate;
  }

  ngOnDestroy(): void {
    this.popupSubscription.unsubscribe();
  }

  get min(): Date {
    return this.start ? addDays(this.start, 1) : null;
  }

  get max(): Date {
    return this.end ? addDays(this.end, -1) : null;
  }

  onStartChange(value: Date): void {
    this.filterRange(value, this.end);
  }

  onEndChange(value: Date): void {
    this.filterRange(this.start, value);
  }

  private findValue(operator) {
    const filter = this.currentFilter.filters.filter(
      (x) => (x as FilterDescriptor).field === this.field && (x as FilterDescriptor).operator === operator
    )[0];
    return filter ? (filter as FilterDescriptor).value : null;
  }

  private filterRange(start, end) {
    const filters = [];

    if (start && (!end || start < end)) {
      const startDateString = this.datePipe.transform(start, 'yyyy-MM-ddT00:00:00');
      filters.push({
        field: this.field,
        operator: 'gte',
        value: startDateString
      });
      this.start = start;
    }

    if (end && (!start || start < end)) {
      const endDateString = this.datePipe.transform(end, 'yyyy-MM-ddT00:00:00');
      filters.push({
        field: this.field,
        operator: 'lte',
        value: this.datePipe.transform(endDateString, 'yyyy-MM-ddT23:59:59')
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: 'and',
      filters: filters
    });
  }
}
