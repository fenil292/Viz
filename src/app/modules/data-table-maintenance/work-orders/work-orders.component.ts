import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { BaseResponseModel } from '../../../shared/models/base-response.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { WorkOrderModel } from './models/work-order.model';
import { WorkOrderApiService } from './services/work-order-api.service';
import { DefaultPageSize, DefaultPageSizes } from '../../../shared/models/pagination-configuration.model';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { ColumnSettings, ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { CustomAttrbuteEntities, Data, Log, pages } from '../../../shared/models/shared.model';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { WorkOrderLog } from '../work-order-logs/models/work-order-log.model';
import { WorkOrderLogsComponent } from '../work-order-logs/work-order-logs.component';
import { Priority } from '../../aps/priorities/models/priority.model';
import { PriorityService } from '../../aps/priorities/services/priority.service';
import { ExportLogsComponent } from '../../admin/export/export-logs/export-logs.component';
import { CustomAttributeService } from '../../admin/custom-attributes/services/custom-attribute.service';
import { AttributeModel } from '../../admin/custom-attributes/models/custom-attribute.model';
import { cloneDeep } from 'lodash';
import { WorkOrderAttributeEntryComponent } from './work-order-attribute-entry/work-order-attribute-entry.component';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WorkOrdersComponent implements OnInit, AfterViewInit, AfterContentChecked {
  path: string[] = ['Data Table Maintenance', 'Work Orders'];
  index = '4.2';
  isLoading = true;
  workOrders: Array<WorkOrderModel> = [];
  priorities: Array<any> = [{id: 0, value: 'Reset Manual Priority'}];
  selectedPriority: 0;
  selectedItems: any[] = [];
  workOrderPrioritiesForm: FormGroup;
  filterForm: FormGroup;
  filter = {
    from: new Date(Date.now() - 7),
    to: new Date(),
    workOrderNumber: "",
    partNumber: ""
  }
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  }
  entry: any;
  pageSizes = DefaultPageSizes;
  pageSize = DefaultPageSize;
  gridSettings: GridState;
  columnType = ColumnType;
  isLoadingWorkOrderLog: boolean = false;
  isLoadingExportPriorities: boolean = false;
  multiCheckFilterColumns: string[] = ['priorityCode', 'partNumber', 'partRevision', 'customerId'];
  filterDataArray: unknown;
  workOrder: any = null;
  skip: number = 0;
  workOrderAttributes: AttributeModel[] = [];
  customAttributeAsColumns: string[] = [];
  @ViewChild('gridTooltip') tooltipDir: TooltipDirective;

  constructor(private apiWorkOrdersService: WorkOrderApiService,
    private cdref: ChangeDetectorRef,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private dialogService: DialogService,
    private priorityService: PriorityService,
    private customAttributeService: CustomAttributeService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.setDefaultFromAndToFilter();
    this.createWorkOrderPrioritiesForm();
    this.createFilterForm();
    this.getWorkOrders();
    this.getPriorities();
    const defaultGridSettings = this.prepareWorkOrderGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.WORK_ORDERS, defaultGridSettings);
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
        this.getWorkOrders();
      }
    }
  }

  updatePriorities(): void {
    const updatePriorityModel = {
      resetManualPriority: this.workOrderPrioritiesForm.controls.priorityId.value === 0 ? true : false,
      priorityId: this.workOrderPrioritiesForm.controls.priorityId.value,
      workOrderNumbers: this.selectedItems
    };

    this.isLoading = true;
    this.apiWorkOrdersService.updateWorkOrderPriorities(updatePriorityModel).subscribe({
      next: (response: BaseResponseModel<any>) => {
        this.isLoading = false;
        this.selectedItems = [];
        this.initializeWorkOrderPrioritiesForm();
        this.getWorkOrders();
        this.notificationService.success('Selected work orders priority has been updated successfully.');
      },
      error: (error) => {
        this.notificationService.error(error);
        this.isLoading = false;
      }
    });
  }

  onExprortPrioritiesToERP() {
    this.isLoadingExportPriorities = true;
    this.apiWorkOrdersService.exportWorkOrderPriorities(this.selectedItems).subscribe({
      next: (response: BaseResponseModel<any>) => {
        this.selectedItems = [];
        this.openWorkOrderExportPrioritiesLogs(response.logs);
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.logs?.length > 0) {
          this.openWorkOrderExportPrioritiesLogs(err.logs);
        }
      }
    }).add(() => this.isLoadingExportPriorities = false);
  }

  onSelectedKeysChange() {
    this.enableOrDisableControls();
  }

  onChangePageFilters(value: string) {
    if(value === '') {
      this.pageFilterChanges();
    }
  }

  dataStateChange(state: State) {
    this.skip = state.skip;
    this.selectedItems = [];
    this.enableOrDisableControls();
    this.statePersistingService.saveDataStateChange(pages.WORK_ORDERS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.WORK_ORDERS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.WORK_ORDERS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.WORK_ORDERS, columns, this.gridSettings);
  }

  onCustomAttributesChange(values: any[]) {
    this.statePersistingService.saveCustomAttributesColumns(pages.WORK_ORDERS, values, this.workOrderAttributes, this.gridSettings);
    this.gridSettings = cloneDeep(this.gridSettings);
  }

  getWorkOrderLogs(workOrder: WorkOrderModel) {
    this.isLoadingWorkOrderLog = true;
    this.apiWorkOrdersService.getWorkOrderLogs(workOrder.id).subscribe({
      next: (response: BaseResponseModel<Array<WorkOrderLog>>) => {
        const workOrderLogs = response.data;
        this.openWorkOrderLogsDialog(workOrderLogs, workOrder.workOrderNumber);
      },
      error: (error: any) => {
        this.notificationService.error(error.message ?? error);
        if(error?.data?.length > 0) {
          this.openWorkOrderLogsDialog(error.data, workOrder.workOrderNumber);
        }
      }
    }).add(() => this.isLoadingWorkOrderLog = false);
  }

  private getWorkOrders(): void {
    this.isLoading = true;
    this.apiWorkOrdersService.getWorkOrdersList(this.filter).subscribe({
      next: (response: BaseResponseModel<Array<WorkOrderModel>>) => {
        this.workOrders = response.data;
        this.getWorkOrderCustomAttributes();
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => {
      this.selectedItems = [];
      this.isLoading = false;
      this.skip = 0;
      this.setFilterArrays();
    });
  }

  private getPriorities(): void {
    this.priorityService.getPriorityInfos().subscribe({
      next: (res: Data<Priority[]>) => {
        if(res.data) {
          const priorities = res.data.sort((a, b) => a.sequence - b.sequence).map((x: Priority) => ({id: x.id, value: x.priorityCode}));
          this.priorities.push(...priorities);
        }
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    });
  }

  private createWorkOrderPrioritiesForm(): void {
    this.workOrderPrioritiesForm = this.formBuilder.group({
      priorityId: ['', [Validators.required]],
    })
    this.enableOrDisableControls();
  }

  private initializeWorkOrderPrioritiesForm() {
    this.workOrderPrioritiesForm.controls.priorityId.patchValue(null);
    this.enableOrDisableControls();
  }

  private enableOrDisableControls() {
    if (this.selectedItems && this.selectedItems?.length > 0) {
      this.workOrderPrioritiesForm.controls.priorityId.enable();
    }
    else {
      this.workOrderPrioritiesForm.controls.priorityId.reset();
      this.workOrderPrioritiesForm.controls.priorityId.patchValue(null);
      this.workOrderPrioritiesForm.controls.priorityId.disable();
    }
  }

  private setDefaultFromAndToFilter() {
    this.filter.from = this.filter.to = null;
  }

  private createFilterForm() {
    this.filterForm = this.formBuilder.group({
      from: [this.filter.from],
      to:[this.filter.to],
      workOrderNumber: [this.filter.workOrderNumber],
      partNumber: [this.filter.partNumber]
    });
  }

  private prepareWorkOrderGridState(): GridState {
    return {
      columnConfig: [
        { field: '', title: '', order: 0, type: ColumnType.SELECTABLE_CHECKBOX, width: 50 },
        { field: 'priorityCode', title: 'Priority', order: 1, type: ColumnType.TEXT },
        { field: 'workOrderNumber', title: 'Work Order', order: 2, type: ColumnType.NUMBER },
        { field: 'partNumber', title: 'Part Number', order: 3, type: ColumnType.TEXT },
        { field: 'partRevision', title: 'Part Revision', order: 4, type: ColumnType.TEXT },
        { field: 'partDescription', title: 'Part Description', order: 5, type: ColumnType.TEXT },
        { field: 'salesOrderNumber', title: 'Sales Order Number', order: 6, type: ColumnType.NUMBER },
        { field: 'customerId', title: 'Customer ID', order: 7, type: ColumnType.TEXT },
        { field: 'requiredDate', title: 'Required Date', order: 8, type: ColumnType.DATE },
        { field: 'totalPrice', title: 'Total Price', order: 9, type: ColumnType.NUMBER },
        { field: 'requiredQuantity', title: 'Quantity', order: 10, type: ColumnType.NUMBER },
        { field: 'Actions', title: 'Actions', order: 11, type: ColumnType.ACTION}
      ],
      state: this.state
    }
  }

  onCellClick(event: any): void {
    if (event) {
      this.entry = event;
      const isCustomAttribute = this.gridSettings.columnConfig.findIndex((column: ColumnSettings) => column.field === event?.column?.field && column.isCustomAttribute);
      if(isCustomAttribute > -1) {
        this.entry = null;
        this.onEditWorkOrderAttribute(event.dataItem.id, event.column.field, event.dataItem[event.column.field]);
      }
    }
  }
  
  getToday(): Date {
    const date = new Date(Date.now());
    date.setHours(23);
    date.setMinutes(59);
    return  date;
  }

  onRowDoubleClick(workOrderId: any, event: any) {
    if(event) {
      const row = event?.target?.closest('td')?.closest('tr');
      if(row?.rowIndex >= 0 && !row?.classList?.contains('k-grid-norecords')) {
        this.openWorkOrderDetails(workOrderId);
      }
    }
  }

  openWorkOrderDetails(workOrderId: any): void {
    if(workOrderId) {
      this.tooltipDir.hide();
      this.workOrder = workOrderId;
    }
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }

  showWorkOrders(event: any) {
    if(event?.status) {
      this.workOrder = null;
      if(event?.workOrder) {
        const index = this.workOrders.findIndex((x: WorkOrderModel) => x.id === event.workOrder.id);
        if(index > -1) {
          this.workOrders[index] = event.workOrder;
          event.workOrder.attributes.forEach(x => {
            this.workOrders[index][x.name] = x.value;
          });
          this.workOrders = [...this.workOrders];
        }
      }
    }
  }

  private openWorkOrderLogsDialog(logs: WorkOrderLog[], workOrderNumber: string) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: WorkOrderLogsComponent,
      actions: [],
      height: '60%',
      width: '50%',
      actionsLayout: 'normal',
      cssClass: 'workorder-log-dialog'
    });

    const data = dialogRef.content.instance as WorkOrderLogsComponent;
    data.workOrderLogs = logs;
    data.workOrderNumber = workOrderNumber;
  }

  private openWorkOrderExportPrioritiesLogs(logs: Log[]) {
    const dialogRef = this.dialogService.open({
      content: ExportLogsComponent,
      actionsLayout: 'normal',
      cssClass: 'export-log-dialog'
    });

    const data = dialogRef.content.instance as ExportLogsComponent;
    data.exportLogs = logs;
    data.title = 'Export Priorities Logs';
  }

  private onEditWorkOrderAttribute(workOrderId: number, attributeName: string, attributeValue: string) {
    const dialogRef = this.dialogService.open({
      content: WorkOrderAttributeEntryComponent,
      actionsLayout: 'normal',
      cssClass: 'work-order-attribute-entry-dialog'
    });

    const data = dialogRef.content.instance as WorkOrderAttributeEntryComponent;
    data.workOrderId = workOrderId;
    data.attributeName = attributeName;
    data.attributeValue = attributeValue;

    dialogRef.result.subscribe((result: any) => {
      if(result?.status && result?.data !== undefined) {
        const workOrderIndex = this.workOrders.findIndex((x: WorkOrderModel) => x.id === workOrderId);
        if(workOrderIndex > -1) {
          this.workOrders[workOrderIndex][attributeName] = result.data;
          this.workOrders = [...this.workOrders];
        }
      }
    });
  }

  private setFilterArrays() {
    this.filterDataArray = {};
    this.multiCheckFilterColumns.forEach((column: string) => {
      this.filterDataArray[column] = [...new Set(this.workOrders.filter((x: any) => x[column] !== '' && x[column] !== null).map(x => x[column]))];
    })
  }

  private getWorkOrderCustomAttributes() {
    this.isLoading = true;
    this.workOrderAttributes = [];
    this.customAttributeService.getCustomAttributesForEntity(CustomAttrbuteEntities.WorkOrder).subscribe({
      next: (res: Data<AttributeModel[]>) => {
        this.workOrderAttributes = res.data;
        this.customAttributeAsColumns = this.statePersistingService.updateAttributeColumnName(pages.WORK_ORDERS, this.gridSettings, this.workOrderAttributes);
      }
    }).add(() => this.isLoading = false);
  }
}
