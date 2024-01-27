import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SalesOrder } from './models/sales-order.model';
import { SalesOrderService } from './services/sales-order.service';
import { CustomAttrbuteEntities, Data, pages } from '../../../shared/models/shared.model';
import { DefaultPageSize, DefaultPageSizes } from '../../../shared/models/pagination-configuration.model';
import { ColumnSettings, ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { AttributeModel } from '../../admin/custom-attributes/models/custom-attribute.model';
import { CustomAttributeService } from '../../admin/custom-attributes/services/custom-attribute.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SalesOrdersComponent implements OnInit, AfterViewInit, AfterContentChecked {
  path: string[] = ['Data Table Maintenance', 'Sales Orders'];
  index = '4.4';
  filter: any = {
    from: null,
    to: null,
    salesOrderNumber: "",
    partNumber: ""
  };
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  }
  filterForm: FormGroup;
  salesOrders: SalesOrder[] = [];
  isLoading: boolean = false;
  pageSizes = DefaultPageSizes;
  pageSize = DefaultPageSize;
  gridSettings: GridState;
  columnType = ColumnType;
  skip: number = 0;
  multiCheckFilterColumns: string[] = ['partNumber'];
  filterDataArray: unknown;
  salesOrderId: any = null;
  entry: any;
  salesOrderAttributes: AttributeModel[] = [];
  customAttributeAsColumns: string[] = [];
  @ViewChild('gridTooltip') tooltipDir: TooltipDirective;
  
  constructor(
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private utilityService: UtilityService,
    private salesOrderService: SalesOrderService,
    private notificationService: NotificationService,
    private customAttributeService: CustomAttributeService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.prepareFilterForm();
    this.getSalesOrders();
    const defaultGridSettings = this.prepareSalesOrderGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.SALES_ORDERS, defaultGridSettings);
    this.customAttributeAsColumns = this.gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);
  }

  ngAfterViewInit() {
    var datePicker = document.querySelectorAll(".v-datepicker .k-input-button");
  
    datePicker.forEach(button => {
      var btn = document.createElement("button");
      btn.setAttribute( "class", "k-button k-button-clear");

      var icon = document.createElement("span");
      icon.setAttribute("class", "k-button-icon k-icon k-i-x clear-button");
  
      btn.appendChild(icon);
  
      btn.addEventListener("click", (e: any) => {
        if(e.srcElement?.parentElement?.parentElement?.className?.includes('v-datepicker-from')) {
          this.filterForm.controls.from.patchValue(null);
        }
        else if(e.srcElement?.parentElement?.parentElement?.className?.includes('v-datepicker-to')) {
          this.filterForm.controls.to.patchValue(null);
        }
      });
      button.parentNode.insertBefore(btn, button);
    }); 
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  pageFilterChanges(): void {
    this.filterForm.markAllAsTouched();
    if(this.filterForm.valid) {
      const filter = this.filterForm.getRawValue();
      const change = this.utilityService.compareArrays(filter, this.filter as any);
      if(!change) {
        this.filter = filter;
        this.getSalesOrders();
      }
    }
  }

  onChangePageFilters(value: string) {
    if(value === '') {
      this.pageFilterChanges();
    }
  }

  onRowDoubleClick(id: number, event: any) {
    if(event) {
      const row = event?.target?.closest('td')?.closest('tr');
      if(row?.rowIndex >= 0 && !row?.classList?.contains('k-grid-norecords')) {
        this.openSalesOrderDetails(id);
      }
    }
  }

  openSalesOrderDetails(id: number) {
    if(id) {
      this.tooltipDir.hide();
      this.salesOrderId = id;
    }
  }

  onShowSalesOrders(event: any) {
    if(event?.status) {
      this.salesOrderId = null;
      if(event?.salesOrder) {
        const index = this.salesOrders.findIndex((x: SalesOrder) => x.id === event.salesOrder.id);
        if(index > -1) {
          event.salesOrder.attributes.forEach(x => {
            this.salesOrders[index][x.name] = x.value;
          });
          this.salesOrders = [...this.salesOrders];
        }
      }
    }
  }

  onCellClick(event: any) {
    if (event) {
      this.entry = event;
    }
  }

  dataStateChange(state: State) {
    this.skip = state.skip;
    this.statePersistingService.saveDataStateChange(pages.SALES_ORDERS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.SALES_ORDERS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.SALES_ORDERS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.SALES_ORDERS, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  onCustomAttributesChange(values: any[]) {
    this.statePersistingService.saveCustomAttributesColumns(pages.SALES_ORDERS, values, this.salesOrderAttributes, this.gridSettings);
    this.gridSettings = cloneDeep(this.gridSettings);
  }

  private getSalesOrders() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrders(this.filter).subscribe({
      next: (res: Data<SalesOrder[]>) => {
        this.salesOrders = res.data;
        this.getSalesOrderCustomAttributes();
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    }).add(() => {
      this.isLoading = false;
      this.skip = 0;
      this.setFilterArrays();
    });
  }

  private getSalesOrderCustomAttributes() {
    this.isLoading = true;
    this.salesOrderAttributes = [];
    this.customAttributeService.getCustomAttributesForEntity(CustomAttrbuteEntities.SalesOrder).subscribe({
      next: (res: Data<AttributeModel[]>) => {
        this.salesOrderAttributes = res.data;
        this.customAttributeAsColumns = this.statePersistingService.updateAttributeColumnName(pages.SALES_ORDERS, this.gridSettings, this.salesOrderAttributes);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareFilterForm() {
    this.filterForm = this.formBuilder.group({
      from: [this.filter.from],
      to:[this.filter.to],
      salesOrderNumber: [this.filter.salesOrderNumber],
      partNumber: [this.filter.partNumber]
    });
  }

  private prepareSalesOrderGridState(): GridState {
    return {
      columnConfig: [
        { field: 'salesOrderNumber', title: 'Sales Order Number', order: 1, type: ColumnType.TEXT },
        { field: 'requiredDate', title: 'Required Date', order: 2, type: ColumnType.DATE },
        { field: 'requiredQty', title: 'Required Qty', order: 3, type: ColumnType.NUMBER },
        { field: 'partNumber', title: 'Part', order: 4, type: ColumnType.TEXT },
        { field: 'shipQty', title: 'Ship Qty', order: 5, type: ColumnType.NUMBER },
        { field: 'allocatedQty', title: 'Allocated Qty', order: 6, type: ColumnType.NUMBER },
        { field: 'Actions', title: 'Actions', order: 7, type: ColumnType.ACTION}
      ],
      state: this.state
    }
  }

  private setFilterArrays() {
    this.filterDataArray = {};
    this.multiCheckFilterColumns.forEach((column: string) => {
      this.filterDataArray[column] = [...new Set(this.salesOrders.filter((x: any) => x[column] !== '' && x[column] !== null).map(x => x[column]))];
    })
  }
}
