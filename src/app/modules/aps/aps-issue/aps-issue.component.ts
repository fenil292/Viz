import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { NotificationService } from '../../../shared/services/notification.service';
import { Data, pages } from '../../../shared/models/shared.model';
import { ApsIssue } from './models/aps-issue.model';
import { ApsIssueService } from './services/aps-issue.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { ApsIssueDetailsComponent } from './aps-issue-details/aps-issue-details.component';
import { ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-aps-issue',
  templateUrl: './aps-issue.component.html',
  styleUrls: ['./aps-issue.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ApsIssueComponent implements OnInit {

  path: any[] = ["APS", "APS Data Issues"];
  index: string = "2.4";
  isLoading: boolean = false;
  apsIssues: ApsIssue[] = [];
  state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  
  constructor(
    private dialogService: DialogService,
    private apsIssueService: ApsIssueService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getApsIssues();
    const defaultGridSettings = this.prepareApsIssueGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.APS_ISSUES, defaultGridSettings);
  }

  openApsIssueDialog(apsIssue: ApsIssue) {
    const dialogRef = this.dialogService.open({
      content: ApsIssueDetailsComponent,
      actions: [],
      width: '645px',
      actionsLayout: 'normal',
      cssClass: 'aps-detail-dialog'
    });
    const data = dialogRef.content.instance as ApsIssueDetailsComponent;
    data.apsIssueDetail = apsIssue;
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.APS_ISSUES, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.APS_ISSUES, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.APS_ISSUES, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.APS_ISSUES, columns, this.gridSettings);
  }

  private getApsIssues() {
    this.apsIssues = []
    this.isLoading = true;
    this.apsIssueService.getApsIssues().subscribe({
      next: (res: Data<ApsIssue[]>) => {
        this.apsIssues = res.data;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareApsIssueGridState(): GridState {
    return {
      columnConfig: [
        { field: 'workOrderNumber', title: 'Work Order', order: 0, type: ColumnType.NUMBER, width: 200 },
        { field: 'message', title: 'Error Descriptions', order: 1, type: ColumnType.TEXT },
        { field: 'solution', title: 'Resolution Steps', order: 2, type: ColumnType.TEXT },
        { field: 'timestamp', title: 'Timestamp', order: 3, type: ColumnType.DATE, width: 220 },
        { field: 'Actions', title: 'Actions', order: 4, type: ColumnType.ACTION, width: 150 }
      ],
      state: this.state
    }
  }
}
