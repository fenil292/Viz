import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';
import { Data, pages } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { CreatePriorityComponent } from './create-priority/create-priority.component';
import { Priority } from './models/priority.model';
import { PriorityService } from './services/priority.service';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent, FilterService } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.scss']
})
export class PrioritiesComponent implements OnInit {
  path: string[] = ["APS", "Scheduling Priorities"];
  index: string = "2.1";
  priorities: Priority[] = [];
  isLoading: boolean = false;
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  multiCheckFilterColumns: string[] = ['priorityCode'];
  filterDataArray: unknown;
  @ViewChild(TooltipDirective) tooltipDir: TooltipDirective;
  
  constructor(
    private dialogService: DialogService,
    private priorityService: PriorityService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private utilityService: UtilityService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getPriorities();
    const defaultGridSettings = this.preparePriorityGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.PRIORITIES, defaultGridSettings);
  }

  onAddPriority() {
    this.openPriorityDialog();
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

  onEditPriority(id: number) {
    this.openPriorityDialog(id);
  }

  onDeletePriority(id: number) {
    this.confirmDialogService.openConfirmDialog("Confirmation", "Are you sure you want to delete this Priority?")
      .subscribe((response: any) => {
        if (response.status) {
          this.deletePriority(id);
        }
      });
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.PRIORITIES, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.PRIORITIES, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.PRIORITIES, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.PRIORITIES, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }

  private getPriorities() {
    this.isLoading = true;
    this.priorityService.getPriorityInfos().subscribe({
      next: (res: Data<Priority[]>) => {
        this.priorities = res.data?.sort((a, b) => a.sequence === b.sequence ? (a.priorityCode < b.priorityCode ? -1 : 1) : a.sequence - b.sequence);
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.setFilterArrays();
    });
  }

  private openPriorityDialog(id: number | undefined = undefined) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: CreatePriorityComponent,
      width: '592px',
      height: '391px',
      cssClass: 'priority-dialog'
    });

    if(id) {
      const data = dialogRef.content.instance as CreatePriorityComponent;
      data.priorityId = id;
    }

    dialogRef.result.subscribe((result: any) => {
      if(result?.status) {
        this.getPriorities();
      }
    });
  }

  private deletePriority(id: number) {
    this.priorityService.deletePriorityInfo(id).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success('Priority has been deleted successfully.');
        this.getPriorities();
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    })
  }

  private preparePriorityGridState(): GridState {
    return {
      columnConfig: [
        { field: 'priorityCode', title: 'Priority', order: 0, type: ColumnType.TEXT, width: 220 },
        { field: 'sequence', title: 'Sequence', order: 1, type: ColumnType.NUMBER, width: 120 },
        { field: 'viewableMessage', title: 'Viewable Message', order: 2, type: ColumnType.TEXT },
        { field: 'hotSheet', title: 'HotSheet', order: 3, type: ColumnType.CHECKBOX, width: 120 },
        { field: 'matrixUI', title: 'MatrixUI', order: 4, type: ColumnType.CHECKBOX, width: 120 },
        { field: 'color', title: 'Color Scheme', order: 5, type: ColumnType.COLOR, width: 140 },
        { field: 'Actions', title: 'Actions', order: 6, type: ColumnType.ACTION, width: 140 }
      ],
      state: this.state
    }
  }

  public onSwitchChange(value: any, filterService: FilterService, field: string): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: 'eq',
        value: value
      }],
      logic: "or"
    })
  }

  private setFilterArrays() {
    this.filterDataArray = {};
    this.multiCheckFilterColumns.forEach((column: string) => {
      this.filterDataArray[column] = [...new Set(this.priorities.filter((x: any) => x[column] !== '' && x[column] !== null).map(x => x[column]))];
    })
  }
}
