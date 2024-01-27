import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State, DataResult } from '@progress/kendo-data-query';
import { ConfirmDialogService } from '../../shared/helpers/confirm-dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { HotsheetPriorityShortModel } from './models/hotsheet-priority.interface';
import { HotsheetsModel } from './models/hotsheets.model';
import { UpdateHotSheetsModel } from './models/update-hotsheets.model';
import { HotsheetsApiService } from './services/hotsheets-api.service';
import { UtilityService } from '../../shared/helpers/utility.service';
import { ColumnType, GridState } from '../../shared/models/column-settings.model';
import { StatePersistingService } from '../../shared/helpers/state-persisting.service';
import { Data, pages } from '../../shared/models/shared.model';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { PriorityService } from '../aps/priorities/services/priority.service';
import { Priority } from '../aps/priorities/models/priority.model';
import { cloneDeep, difference } from 'lodash';
import { DialogService } from '@progress/kendo-angular-dialog';
import { HotsheetAttributeEntryComponent } from './hotsheet-attribute-entry/hotsheet-attribute-entry.component';
import { AttributeModel } from '../admin/custom-attributes/models/custom-attribute.model';

@Component({
  selector: 'app-hotsheets',
  templateUrl: './hotsheets.component.html',
  styleUrls: ['./hotsheets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HotsheetsComponent implements OnInit {
  path: any[] = ["Hot Sheet"];
  index: string = "1";
  isLoading = false;
  gridData: DataResult;
  hotsheets: HotsheetsModel[];
  workOrderId: number = null;
  salesOrderId: number = null;
  customerAttributes: AttributeModel[];
  filterhotsheets: HotsheetsModel[];
  selectedItems: any[] = [];
  selectedPriority: 0;
  priorities: HotsheetPriorityShortModel[] = [{id: 0, value: 'Reset Manual Priority'}];
  hotSheetPrioritiesForm: FormGroup;
  showClearFilter = false;
  filterForm: FormGroup;
  hotSheetEntry: any;
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  hotsheetExcel: any = {
    sortColumn: '',
    sortDirection: '',
    workOrderNumber: ''
  }
  isExcelLoading: boolean = false;
  isWorkOrderAttributesLoading: boolean = false;
  multiCheckFilterColumns: string[] = ['priorityCode', 'partNumber'];
  filterDataArray: unknown;
  unusedColumns: string[] = ['id', 'priorityColor', 'priorityViewableMessage', 'publishDateTime', 'dueDateCaption', 'partRev', 'quantityUom', 'alternativeConstraints', 'workOrderId', 'salesOrderId'];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  constructor(
    private formBuilder: FormBuilder,
    private publicApiHotsheets: HotsheetsApiService,
    private confirmDialogService: ConfirmDialogService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private priorityService: PriorityService,
    private dialogService: DialogService,
    @Inject(DOCUMENT) private document: Document,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.createHotSheetPrioritiesForm();
    this.createFilterForm();
    this.getHotsheets();
    this.getHotsheetPriorities();
    const defaultGridSettings = this.prepareHotSheetGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.HOTSHEETS, defaultGridSettings);
  }

  setCellClassByPriority(item: any): any {
    if (item?.priorityColor) {
      return `#${item.priorityColor.trim().replace('#','')}`;
    }
    return '';
  }

  onSelectedKeysChange() {
    this.enableOrDisableControls();
  }

  openUpdatePrioritiesConfirmDialog(): void {
    const priorityName = this.priorities.find(x => x.id === this.hotSheetPrioritiesForm.controls.priorityInfoId.value).value;
    this.confirmDialogService.openConfirmDialog("Confirmation", `Are you sure you want to update the Work Order Priorities to the ${priorityName}?`,"Update","vs-primary")
      .subscribe((response: any) => {
        if (response.status) {
          this.updatePriorities();
        }
      });
  }

  updatePriorities(): void {
    const data = <UpdateHotSheetsModel>{
      resetManualPriority: this.hotSheetPrioritiesForm.controls.priorityInfoId.value === 0 ? true : false,
      priorityInfoId: this.hotSheetPrioritiesForm.controls.priorityInfoId.value,
      workOrderNumbers: this.selectedItems
    }
    this.publicApiHotsheets.updateHotSheetList(data).subscribe({
      next: (r) => {
        this.notificationService.success('Selected hotsheets priority has been updated successfully.');
        this.getHotsheets();
      }, error: (error) => {
        this.notificationService.error(error);
      }
    });
  }

  onChangePageFilters(value: string) {
    if(value === '') {
      this.onHotsheetFilter();
    }
  }

  onHotsheetFilter() {
    this.isLoading = true;
    this.filterhotsheets = this.hotsheets;
    this.selectedItems = [];
    this.showClearFilter = true;
    this.enableOrDisableControls();
    const filter = this.filterForm.getRawValue() as any;
    if(filter.priority?.id !== null && filter.priority !== null) {
      this.filterhotsheets = this.filterhotsheets.filter((item: HotsheetsModel) => item.priorityCode === filter.priority.value);
    }
    if(filter.workorder.trim() !== '') {
      this.filterhotsheets = this.filterhotsheets.filter((item: HotsheetsModel) => item.workOrderNumber === filter.workorder.trim());
    }
    if(filter.priority === null && filter.workorder === '') {
      this.showClearFilter = false;
    }
    this.isLoading = false;
    this.setFilterArrays();
  }

  clearHotsheetFilter() {
    this.createFilterForm();
    this.onHotsheetFilter();
    this.showClearFilter = false;
  }

  dataStateChange(state: State) {
    this.selectedItems = [];
    this.enableOrDisableControls();
    this.statePersistingService.saveDataStateChange(pages.HOTSHEETS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.HOTSHEETS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.HOTSHEETS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.HOTSHEETS, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  exportToExcel() {
    this.hotsheetExcel.workOrderNumber = this.filterForm.controls.workorder.value;
    if(this.gridSettings.state.sort?.length > 0) {
      this.hotsheetExcel.sortColumn = this.gridSettings.state.sort[0].field;
      this.hotsheetExcel.sortDirection = this.gridSettings.state.sort[0].dir ?? null;
    }
    this.getHotsheetExcel();
  }

  onHotSheetCellClick(event: any): void {
    if (event) {
      const attribute = this.customerAttributes.find((attribute : AttributeModel) => attribute.name === event?.column?.field);
      const hotSheet = this.hotsheets.find((hotSheet: HotsheetsModel ) => hotSheet.id === event?.dataItem?.id);
      this.hotSheetEntry = null;
      if (event.column.field === 'workOrderNumber' || event.column.field === 'salesOrderNumber' ) {
        this.hotSheetEntry = event;
      }
      if (attribute && hotSheet) {
        this.onEditHotSheetAttribute(event?.dataItem?.id, attribute, event?.dataItem?.[event.column.field]);
      }
    }
  }

  onHotSheetDoubleClick(workOrderId: number, salesOrderId: number, event: any) {
    if(event) {
      const row = event?.target?.closest('td')?.closest('tr');
      if(row?.rowIndex >= 0 && !row?.classList?.contains('k-grid-norecords')) {
        if (this.hotSheetEntry?.column?.field === 'workOrderNumber') {
          this.openWorkOrderDetails(workOrderId);
        }
        else if (this.hotSheetEntry?.column?.field === 'salesOrderNumber') {
          this.openSalesOrderDetails(salesOrderId);
        }
      }
    }
  }

  openWorkOrderDetails(workOrderId: any) {
    if(workOrderId && this.hotSheetEntry.column.field === 'workOrderNumber') {
      this.tooltipDir.hide();
      this.workOrderId = workOrderId;
    }
  }

  openSalesOrderDetails(salesOrderId: number) {
    if(salesOrderId && this.hotSheetEntry.column.field === 'salesOrderNumber') {
      this.tooltipDir.hide();
      this.salesOrderId = salesOrderId;
    }
  }

  updateWorkOrder(event: any) {
    if(event?.status) {
      this.workOrderId = null;
      if(event?.workOrder) {
        const index = this.hotsheets.findIndex((x: HotsheetsModel) => x.workOrderId === event.workOrder.id);
        if(index > -1) {
          this.updatePriorityCodeWithColor(index, event.workOrder.priorityCode);
          this.updateHotSheetRow(event.workOrder.attributes, index);
        }
      }
    }
  }

  updateSalesOrder(event: any) {
    if(event?.status) {
    this.salesOrderId = null;
      if(event?.salesOrder) {
        const index = this.hotsheets.findIndex((x: HotsheetsModel) => x.salesOrderId === event.salesOrder.id);
        if(index > -1) {
          this.updateHotSheetRow(event.salesOrder.attributes, index)
        }
      }
    }
  }

  private getHotsheets() {
    this.isLoading = true;
    this.publicApiHotsheets.getHotSheetList().subscribe({
      next: (response) => {
        this.hotsheets = response.data.hotSheets;
        this.customerAttributes = response.data.customerAttributes;
        this.filterhotsheets = response.data.hotSheets;
        this.gridData = {
          data: this.filterhotsheets,
          total: this.filterhotsheets.length
        }
        this.selectedItems = [];
        this.initializeHotSheetPrioritiesForm();
        this.addCustomAttributesColumns();
      },
      error: (error) => this.notificationService.error(error)
    }).add(() => {
      this.isLoading = false;
      this.onHotsheetFilter();
      this.setFilterArrays();
    });
  }

  private getHotsheetPriorities() {
    this.priorityService.getPriorityInfos().subscribe({
      next: (res: Data<Priority[]>) => {
        if(res.data) {
          const priorities = res.data.sort((a, b) => a.sequence - b.sequence)
                            .map((x: Priority) => ({id: x.id, value: x.priorityCode, color: x.color}));
          this.priorities.push(...priorities);
        }
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    });
  }

  private getHotsheetExcel() {
    this.isExcelLoading = true;
    this.publicApiHotsheets.getHotSheetExcel(this.hotsheetExcel).subscribe({
      next: (res: any) => {
        this.downloadFile(res);
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isExcelLoading = false);
  }

  private createHotSheetPrioritiesForm(): void {
    this.hotSheetPrioritiesForm = this.formBuilder.group({
      priorityInfoId: ['', [Validators.required]],
    })
    this.enableOrDisableControls();
  }

  private initializeHotSheetPrioritiesForm() {
    this.hotSheetPrioritiesForm.controls.priorityInfoId.patchValue(null);
    this.enableOrDisableControls();
  }

  private enableOrDisableControls() {
    if (this.selectedItems && this.selectedItems?.length > 0) {
      this.hotSheetPrioritiesForm.controls.priorityInfoId.enable();
    }
    else {
      this.hotSheetPrioritiesForm.controls.priorityInfoId.reset();
      this.hotSheetPrioritiesForm.controls.priorityInfoId.patchValue(null);
      this.hotSheetPrioritiesForm.controls.priorityInfoId.disable();
    }
  }

  private createFilterForm() {
    this.filterForm = this.formBuilder.group({
      priority: [null],
      workorder: ['']
    })
  }

  private prepareHotSheetGridState(): GridState {
    return {
      columnConfig: [
        { field: '', title: '', order: 0, type: ColumnType.SELECTABLE_CHECKBOX, width: 50 },
        { field: 'priorityCode', title: 'Priority', order: 1, type: ColumnType.TEXT },
        { field: 'dueDate', title: 'WO Due', order: 2, type: ColumnType.DATE },
        { field: 'workOrderNumber', title: 'Work Order', order: 3, type: ColumnType.NUMBER },
        { field: 'salesOrderDueDate', title: 'SO Due', order: 4, type: ColumnType.DATE },
        { field: 'salesOrderNumber', title: 'Sales Order ', order: 5, type: ColumnType.NUMBER },
        { field: 'partNumber', title: 'Part Number', order: 6, type: ColumnType.TEXT },
        { field: 'partDescription', title: 'Part Description', order: 7, type: ColumnType.TEXT },
        { field: 'quantity', title: 'Quantity', order: 8, type: ColumnType.NUMBER },
        { field: 'quantityOnHand', title: 'On Hand', order: 9, type: ColumnType.NUMBER },
        { field: 'hotSheetOperationNumbers', title: 'Processes', order: 10, type: ColumnType.TEXT },
        { field: 'criticalConstraint', title: 'Critical Constraint', order: 11, type: ColumnType.TEXT }
      ],
      state: this.state
    }
  }

  private downloadFile(fileData: any) {
    const fileName = "HotSheet.xlsx";
    const isIE = false || !!(this.document as any)['documentMode'];
    const isChrome = !!(window as any)['chrome'];
    const blob: any = new Blob([fileData], { type: 'application/octetstream' });
    if (isIE) {
      console.log('Manage IE download>10');
      (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
    }
    else {
      const a = document.createElement('a');
      var url = window.URL || window.webkitURL;
      const link = url.createObjectURL(blob);
      a.setAttribute('href', link);
      a.setAttribute('download', fileName);
      a.setAttribute('target', '_self');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  private setFilterArrays() {
    this.filterDataArray = {};
    this.multiCheckFilterColumns.forEach((column: string) => {
      this.filterDataArray[column] = [...new Set(this.hotsheets.filter((x: any) => x[column] !== '' && x[column] !== null).map(x => x[column]))];
    })
  }

  private addCustomAttributesColumns() {
    if(this.hotsheets?.length > 0) {
      const keys = difference(Object.keys(this.hotsheets[0]), this.unusedColumns);
      this.statePersistingService.addCustomAttributesColumns(pages.HOTSHEETS, keys, this.gridSettings);
      this.gridSettings = {...cloneDeep(this.gridSettings)};
    }
  }

  private onEditHotSheetAttribute(hotSheetId: number, attribute: AttributeModel, attributeValue: string) {
    const dialogRef = this.dialogService.open({
      content: HotsheetAttributeEntryComponent,
      actionsLayout: 'normal',
      cssClass: 'hotsheet-attribute-entry-dialog'
    });

    const data = dialogRef.content.instance as HotsheetAttributeEntryComponent;
    data.hotSheetId = hotSheetId;
    data.attributeValue = attributeValue;
    data.attribute = attribute;

    dialogRef.result.subscribe((result: any) => {
      if(result?.status && result?.data !== undefined) {
        const hotSheetIndex = this.hotsheets.findIndex((x: HotsheetsModel) => x.id === hotSheetId);
        if(hotSheetIndex > -1) {
          this.hotsheets[hotSheetIndex][attribute.name] = result.data;
          this.hotsheets = [...this.hotsheets];
        }
      }
    });
  }

  private updateHotSheetRow(attributes: any, index: number) {
    attributes.forEach(x => {
      const attribute = this.customerAttributes.find((attribute : AttributeModel) => attribute.id === x.customAttributeId);
      if (attribute) {
        this.hotsheets[index][attribute.name] = x.value;
      }
    });
    this.hotsheets = [...this.hotsheets];
  }

  private updatePriorityCodeWithColor(index: number, priorityCode: string) {
    this.hotsheets[index]['priorityCode'] = priorityCode;
    const priority = this.priorities.find((x: any) => x.value === priorityCode);
    if(priority) {
      this.hotsheets[index]['priorityColor'] = priority['color'] ?? '';
    }
  }
}
