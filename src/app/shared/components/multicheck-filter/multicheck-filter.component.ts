import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'multicheck-filter',
  templateUrl: './multicheck-filter.component.html',
  styleUrls: ['./multicheck-filter.component.scss']
})
export class MulticheckFilterComponent implements OnInit {
  @Input() field: string = '';
  @Input() currentFilter: CompositeFilterDescriptor;
  @Input() filterService: FilterService;
  @Input() data: string[] = [];
  currentData: string[] = [];
  values: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.currentData = this.data;
    this.values = this.currentFilter.filters?.map((x: any) => x.value);
  }

  onInput(value: string) {
    if(value) {
      this.currentData = this.data?.filter((x: string) => x.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    } else {
      this.currentData = this.data;
    }
  }

  isItemSelected(item: string) {
    return this.values.includes(item);
  }

  onSelectionChange(item: string) {
    const index = this.values.findIndex((x: string) => x === item);
    if(index > -1) {
      this.values.splice(index, 1);
    } else {
      this.values.push(item);
    }
    this.filterService.filter({
      filters: this.values.map((value) => ({
        field: this.field,
        operator: "eq",
        value: value,
      })),
      logic: "or",
    });
  }
}
