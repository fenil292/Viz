import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewEncapsulation, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { DialogService } from '@progress/kendo-angular-dialog';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { ColumnSettings, ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { Data, Log, pages } from '../../../shared/models/shared.model';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { BaseResponseModel } from '../../../shared/models/base-response.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { WorkOrderAttribute, WorkOrderModel } from '../work-orders/models/work-order.model';
import { WorkOrderApiService } from '../work-orders/services/work-order-api.service';
import { WorkOrderOperationStatusEnum } from './models/work-order-operation-status.enum';
import { PriorityService } from '../../aps/priorities/services/priority.service';
import { Priority } from '../../aps/priorities/models/priority.model';
import { LinkedSalesOrders, WorkOrderOperationAttribute, WorkOrderOperationModel } from './models/work-order-operation.model';
import { ExportLogsComponent } from '../../admin/export/export-logs/export-logs.component';
import { DataType } from '../../../shared/components/query-builder/constants/query-builder.constants';
import { WorkOrderOperationAttributeEntryComponent } from './work-order-operation-attribute-entry/work-order-operation-attribute-entry.component';
import { cloneDeep, startCase } from 'lodash';

@Component({
  selector: 'app-work-order-operations',
  templateUrl: './work-order-operations.component.html',
  styleUrls: ['./work-order-operations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderOperationsComponent implements OnInit, OnChanges, AfterContentChecked {
  @Input() workOrderId: number | null = null;
  @Output() showWorkOrders = new EventEmitter<any>();
  workOrder: WorkOrderModel;
  path = ['Data Table Maintenance', 'Work Orders', 'Work Order Details'];
  index = '4.2.1';
  isLoading: boolean = false;
  isLoadingExportPriorities: boolean = false;
  state: State = <State> {
    filter: {
      logic: 'and',
      filters: []
    }
  }
  data = [];
  selectedItems: Array<any> = [];
  priorityData: Array<any> = [];
  statusFilterActive = false;
  isWorkOrderDetailUrl: boolean = false;
  isWorkOrderChange = false;
  gridSettings: GridState;
  columnType = ColumnType;
  linkedSalesOrders: LinkedSalesOrders[] = [];
  workOrderOpearionAttributes: WorkOrderOperationAttribute[] = [];
  workOrderAttributes: WorkOrderAttribute[] = [];
  intialWorkOrderAttributes: WorkOrderAttribute[] = [];
  customAttributeAsColumns: string[] = [];
  dataTypes = DataType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private dialogService: DialogService,
    private utilityService: UtilityService,
    private priorityService: PriorityService,
    private notificationService: NotificationService,
    private workOrdersApiService: WorkOrderApiService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getPriorities();
    this.route.queryParams.subscribe((params) => {
      if(params['id']) {
        this.workOrderId = params['id'];
        this.prepareWorkOrderDetail();
      }
    });
    this.route.url.subscribe({
      next: (res: any) => {
        if(res[0]?.path === 'work-order-details') {
          this.isWorkOrderDetailUrl = true;
        }
      }
    });
    const defaultGridSettings = this.prepareWorkOrderOprationGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.WORK_ORDER_OPERATIONS, defaultGridSettings);
    this.customAttributeAsColumns = this.gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.workOrderId?.currentValue) {
      this.isWorkOrderChange = false;
      this.showEmptyWorkOrderDetail();
      this.prepareWorkOrderDetail();
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
 }

  getWorkOrderDetails(workOrderId: number): void {
    this.isLoading = true;
    this.workOrdersApiService.getWorkOrder(workOrderId).subscribe({
      next: (response: BaseResponseModel<WorkOrderModel>) => {
        this.workOrder = response.data;
        this.data = this.workOrder.workOrderOperations;
        this.linkedSalesOrders = this.workOrder?.linkedSalesOrders;
        this.workOrderAttributes = this.workOrder?.attributes;
        this.intialWorkOrderAttributes = cloneDeep(this.workOrder?.attributes)?.sort((a: WorkOrderAttribute, b: WorkOrderAttribute) => a.name > b.name ? 1 : -1);
        if(this.workOrder.workOrderOperations?.length > 0) {
          this.workOrderOpearionAttributes = this.workOrder.workOrderOperations[0].attributes.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
          this.updateAttributeColumnName();
        }
      },
      error: (error: any) => {
        this.notificationService.error(error);
        this.showEmptyWorkOrderDetail();
      }
    }).add(() => this.isLoading = false);
  }

  getPriorities(): void {
    this.priorityData = [{id: 0, value: 'Reset Manual Priority'}];
    this.priorityService.getPriorityInfos().subscribe({
      next: (res: Data<Priority[]>) => {
        if(res.data) {
          const priorities = res.data.sort((a, b) => a.sequence - b.sequence).map((x: Priority) => ({id: x.id, value: x.priorityCode}));
          this.priorityData.push(...priorities);
        }
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    });
  }
  
  cancel(): void {
    if(this.isWorkOrderDetailUrl) {
      this.router.navigateByUrl('/data-table-maintenance/work-orders');
    } else {
      this.showWorkOrders.emit({ status: true, workOrder: this.isWorkOrderChange ? this.workOrder : null });
    }
  }

  onRefresh() {
    this.prepareWorkOrderDetail();
  }

  updatePriorities(id?: any): void {
    const priorities = {
      resetManualPriority: id === 0 ? true : false,
      priorityId: id,
      workOrderNumber: this.workOrder.workOrderNumber,
      operationNumbers: this.selectedItems
    }
    this.isLoading = true;
    this.workOrdersApiService.updateWorkOrderOperationPriorities(priorities).subscribe({
      next: (response) => {
          this.notificationService.success('Priorities have been successfully updated');
          this.selectedItems = [];
          this.isWorkOrderChange = true;
          this.getWorkOrderDetails(this.workOrderId);
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  onExprortPrioritiesToERP() {
    this.isLoadingExportPriorities = true;
    this.workOrdersApiService.exportWorkOrderOperationPriorities(this.workOrder.workOrderNumber, this.selectedItems).subscribe({
      next: (response: BaseResponseModel<any>) => {
        this.selectedItems = [];
        this.openWorkOrderOperationExportPrioritiesLogs(response.logs);
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.logs?.length > 0) {
          this.openWorkOrderOperationExportPrioritiesLogs(err.logs);
        }
      }
    }).add(() => this.isLoadingExportPriorities = false);
  }

  onCustomAttributesChange(values: any[]) {
    this.statePersistingService.saveCustomAttributesColumns(pages.WORK_ORDER_OPERATIONS, values, this.workOrderOpearionAttributes, this.gridSettings);
    this.gridSettings = cloneDeep(this.gridSettings);
  }

  onEditWorkOrderOperationsAttributes(workOrderOperation: WorkOrderOperationModel) {
    const dialogRef = this.dialogService.open({
      content: WorkOrderOperationAttributeEntryComponent,
      actionsLayout: 'normal',
      cssClass: 'work-order-operation-attribute-entry-dialog',
      width: '600px'
    });

    const data = dialogRef.content.instance as WorkOrderOperationAttributeEntryComponent;
    data.attributes = cloneDeep(workOrderOperation.attributes);

    dialogRef.result.subscribe((result: any) => {
      if(result?.status && result?.data) {
        const index = this.data.findIndex((item: WorkOrderOperationModel) => item.step === workOrderOperation.step);
        if(index > -1) {
          this.workOrder.workOrderOperations[index].attributes = result.data;
          this.saveWorkOrder();
        }
      }
    });
  }

  isUpdateEnabled(): boolean {
    return this.selectedItems.length > 0;
  }

  isCheckBoxEnabled(): boolean {
    return this.data.length > 0;
  }

  showOnlyRemainingProcesses(event: any): void {
    if(event.currentTarget.checked) {
      this.data = this.workOrder.workOrderOperations.filter(e => e.status === WorkOrderOperationStatusEnum.NOT_COMPLETED);
      this.statusFilterActive = true;
    } else {
      this.data = this.workOrder.workOrderOperations;
      this.statusFilterActive = false;
    }
  }

  setRowState(row: RowClassArgs): any {
    if(row.dataItem.status === WorkOrderOperationStatusEnum.COMPLETED) {
      return 'k-row-disabled';
    }
  }

  onWorkOrderAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: WorkOrderOperationAttribute, b: WorkOrderOperationAttribute) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialWorkOrderAttributes, attributes);
    if(!isEqual) {
      this.workOrder.attributes = attributes;
      this.saveWorkOrder();
    }
  }

  showTooltip(e: MouseEvent, tooltip: any): void {
    this.utilityService.showTooltip(e, tooltip);
  }

  dataStateChange(state: State) {
    this.selectedItems = [];
    this.isUpdateEnabled();
    this.statePersistingService.saveDataStateChange(pages.WORK_ORDER_OPERATIONS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.WORK_ORDER_OPERATIONS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.WORK_ORDER_OPERATIONS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.WORK_ORDER_OPERATIONS, columns, this.gridSettings);
  }

  openSalesOrderDetails(id: number) {
    this.router.navigate(['/data-table-maintenance/sales-order-details'], { queryParams: { id: id } });
  }

  private saveWorkOrder() {
    setTimeout(() => {
      this.isLoading = true;
    }, 0);
    this.workOrdersApiService.saveWorkOrder(this.workOrder).subscribe({
      next: (res: any) => {
        this.notificationService.success('Work order has been successfully saved.');
        this.isWorkOrderChange = true;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.onRefresh();
    });
  }

  private prepareWorkOrderDetail() {
    if(this.workOrderId) {
      this.statusFilterActive = false;
      this.getWorkOrderDetails(this.workOrderId);
    }
  }

  private openWorkOrderOperationExportPrioritiesLogs(logs: Log[]) {
    const dialogRef = this.dialogService.open({
      content: ExportLogsComponent,
      actionsLayout: 'normal',
      cssClass: 'export-log-dialog'
    });

    const data = dialogRef.content.instance as ExportLogsComponent;
    data.exportLogs = logs;
    data.title = 'Export Priorities Logs';
  }

  private prepareWorkOrderOprationGridState(): GridState {
    return {
      columnConfig: [
        { field: '', title: '', order: 0, type: ColumnType.SELECTABLE_CHECKBOX, width: 50 },
        { field: 'process', title: 'Process', order: 1, type: ColumnType.TEXT },
        { field: 'step', title: 'Step', order: 2, type: ColumnType.NUMBER },
        { field: 'workCenter', title: 'Work Center', order: 3, type: ColumnType.NUMBER},
        { field: 'priority', title: 'Priority', order: 4, type: ColumnType.TEXT },
        { field: 'status', title: 'Status', order: 5, type: ColumnType.TEXT },
        { field: 'manualPriority', title: 'Manual Priority', order: 6, type: ColumnType.CHECKBOX },
        { field: 'Actions', title: 'Actions', order: 7, type: ColumnType.ACTION }
      ],
      state: this.state
    }
  }

  private updateAttributeColumnName() {
    let isChange = false;
    this.gridSettings.columnConfig.forEach((column: ColumnSettings) => {
      if(column.isCustomAttribute) {
        const attribute = this.workOrderOpearionAttributes.find((x: WorkOrderOperationAttribute) => x.customAttributeId === column.customAttributeId);
        if(attribute) {
          const attributeColumnType = this.utilityService.getColumnTypeByType(attribute.datatype);
          if(attribute.name !== column.field || column.type !== attributeColumnType) {
            isChange = true;
            column.field = attribute.name;
            column.title = startCase(attribute.name);
            column.type = attributeColumnType;
          }
        } else {
          isChange = true;
        }
      }
    });
    this.customAttributeAsColumns = this.gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);

    if(isChange) {
      this.onCustomAttributesChange(this.customAttributeAsColumns);
    }
  }

  private showEmptyWorkOrderDetail() {
    this.workOrder = null;
    this.selectedItems = [];
    this.data = [];
    this.customAttributeAsColumns = [];
    this.linkedSalesOrders = [];
    this.workOrderAttributes = [];
    this.workOrderOpearionAttributes = [];
    this.intialWorkOrderAttributes = [];
  }
}
