import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent, FilterService } from '@progress/kendo-angular-grid';
import { BaseResponseModel } from '../../../shared/models/base-response.model';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { WorkCenterModel } from './models/work-center.model';
import { WorkCentersApiService } from './services/work-centers-api.service';
import { WorkCentersEntryComponent } from './work-centers-entry/work-centers-entry/work-centers-entry.component';
import { ColumnSettings, ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { CustomAttrbuteEntities, Data, pages } from '../../../shared/models/shared.model';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { AttributeModel } from '../../admin/custom-attributes/models/custom-attribute.model';
import { CustomAttributeService } from '../../admin/custom-attributes/services/custom-attribute.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-work-centers',
  templateUrl: './work-centers.component.html',
  styleUrls: ['./work-centers.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WorkCentersComponent implements OnInit, AfterContentChecked {
  path: any[] = ["Data Table Maintenance", "Work Centers"];
  index: string = "4.1";
  isLoading = true;
  isExternalWorkCenterLoading = false;
  workCenters: WorkCenterModel[] = [];
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  multiCheckFilterColumns: string[] = ['workCenterId', 'alias'];
  filterDataArray: unknown;
  workCenterAttributes: AttributeModel[] = [];
  customAttributeAsColumns: string[] = [];

  constructor(private apiWorkCentersService: WorkCentersApiService,
    private cdref: ChangeDetectorRef,
    private dialogService: DialogService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private customAttributeService: CustomAttributeService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getWorkCenters();
    const defaultGridSettings = this.prepareWorkCenterGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.WORK_CENTERS, defaultGridSettings);
    this.customAttributeAsColumns = this.gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  openWorkCenterDialog(dataItem: WorkCenterModel): void {
    const dialog = this.dialogService.open({
      content: WorkCentersEntryComponent,
      cssClass: 'work-center-dialog'
    });
    const data = dialog.content.instance as WorkCentersEntryComponent;
    data.id = dataItem.id;
    dialog.result.subscribe((result) => {
      if (result['success']) {
        this.getWorkCenters();
      }
    })
  }

  onDeleteWorkCenter(id: number): void {
    this.confirmDialogService.openConfirmDialog("Confirmation", "Are you sure you want to delete selected Work Center?")
      .subscribe((response: any) => {
        if (response.status) {
          this.deleteWorkCenter(id);
        }
      });
  }

  setCellColorByCode(colorCode: string): string {
    if(colorCode){
      if (colorCode?.startsWith('#')) {
        return `${colorCode}`;
      } else {
        return `#${colorCode}`;
      }
    }
    return "unset";
  }

  onLoadExternalWorkCenters(){
    this.isExternalWorkCenterLoading = true;
    this.apiWorkCentersService.loadExternalWorkCenters().subscribe({
      next: (response: BaseResponseModel<WorkCenterModel>) => {
        this.getWorkCenters();
      },
      error: (error) => this.notificationService.error(error)
    }).add(() => this.isExternalWorkCenterLoading = false);
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.WORK_CENTERS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.WORK_CENTERS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.WORK_CENTERS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.WORK_CENTERS, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent, tooltipDir: any): void {
    this.utilityService.showTooltip(e, tooltipDir);
  }

  onSwitchChange(value: any, filterService: FilterService, field: string): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: 'eq',
        value: value
      }],
      logic: "or"
    })
  }

  onCustomAttributesChange(values: any[]) {
    this.statePersistingService.saveCustomAttributesColumns(pages.WORK_CENTERS, values, this.workCenterAttributes, this.gridSettings);
    this.gridSettings = cloneDeep(this.gridSettings);
  }

  private deleteWorkCenter(id: number): void {
    this.isLoading = true;
    this.apiWorkCentersService.deleteWorkCenter(id).subscribe({
      next: (response: any) => this.notificationService.success('Work center has been deleted successfully.'),
      complete: () => this.getWorkCenters(),
      error: (error) => this.notificationService.error(error)
    }).add(()=> this.isLoading = false);
  }

  private getWorkCenters(): void {
    this.isLoading = true;
    this.apiWorkCentersService.getWorkCenters().subscribe({
      next: (response: BaseResponseModel<WorkCenterModel[]>) => {
        this.workCenters = response.data;
        this.getWorkCenterCustomAttributes();
      },
      error: (error) => this.notificationService.error(error)
    }).add(() => {
      this.isLoading = false;
      this.setFilterArrays();
    });
  }

  private getWorkCenterCustomAttributes() {
    this.isLoading = true;
    this.workCenterAttributes = [];
    this.customAttributeService.getCustomAttributesForEntity(CustomAttrbuteEntities.WorkCenter).subscribe({
      next: (res: Data<AttributeModel[]>) => {
        this.workCenterAttributes = res.data;
        this.customAttributeAsColumns = this.statePersistingService.updateAttributeColumnName(pages.WORK_CENTERS, this.gridSettings, this.workCenterAttributes);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareWorkCenterGridState(): GridState {
    return {
      columnConfig: [
        { field: 'workCenterId', title: 'Work Center ID', order: 0, type: ColumnType.TEXT, width: 120 },
        { field: 'alias', title: 'Alias', order: 1, type: ColumnType.TEXT },
        { field: 'description', title: 'Description', order: 2, type: ColumnType.TEXT },
        { field: 'color', title: 'Color', order: 3, type: ColumnType.COLOR, width: 120 },
        { field: 'fontColor', title: 'Font Color', order: 4, type: ColumnType.COLOR, width: 120},
        { field: 'criticalConstraint', title: 'Critical Constraint', order: 5, type: ColumnType.CHECKBOX, width: 150 },
        { field: 'Actions', title: 'Actions', order: 6, type: ColumnType.ACTION, width: 120 }
      ],
      state: this.state
    }
  }

  private setFilterArrays() {
    this.filterDataArray = {};
    this.multiCheckFilterColumns.forEach((column: string) => {
      this.filterDataArray[column] = [...new Set(this.workCenters.filter((x: any) => x[column] !== '' && x[column] !== null).map(x => x[column]))];
    })
  }
}
