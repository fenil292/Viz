import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { Data, pages } from '../../../../shared/models/shared.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { FailedIntegrationRequest } from './models/failed-integration-requests.model';
import { FailedIntegrationRequestService } from './services/failed-integration-request.service';
import { UtilityService } from '../../../../shared/helpers/utility.service';
import { FailedIntegrationRequestsDetailsComponent } from './failed-integration-requests-details/failed-integration-requests-details.component';
import { ColumnType, GridState } from '../../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../../shared/helpers/state-persisting.service';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-failed-integration-requests',
  templateUrl: './failed-integration-requests.component.html',
  styleUrls: ['./failed-integration-requests.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FailedIntegrationRequestsComponent implements OnInit {

  path: string[] = ["Admin", "Integrations", "Failed Integration Requests"];
  index: string = "5.1.1";
  failedIntegrationRequests: FailedIntegrationRequest[] = [];
  failedIntegrationRequestsLogs: string | null = null;
  dialog: DialogRef;
  @ViewChild('failedIntegrationRequestsLog') public failedIntegrationRequestsLogRef: any;
  isLoading: boolean = false;
  isLoadingFailedIntegrationRequests: boolean = false;
  isLoadingFailedIntegrationRequestsLog: boolean = false;
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
    private failedIntegrationRequestService: FailedIntegrationRequestService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getFailedIntegrationRequests();
    const defaultGridSettings = this.prepareFailedIntegrationGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.FAILED_INTEGRATION_REQUESTS, defaultGridSettings);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  openFailedIntegrationRequestDialog() {
    const dialogRef = this.dialogService.open({
      content: FailedIntegrationRequestsDetailsComponent,
      actions: [],
      width: '700px',
      actionsLayout: 'normal',
      cssClass: 'failed-integration-requests-log-dialog'
    });

    const data = dialogRef.content.instance as FailedIntegrationRequestsDetailsComponent;
    data.failedIntegrationRequestsLogs = this.failedIntegrationRequestsLogs;
  }

  onCancel() {
    this.dialog.close();
  }

  getFailedIntegrationRequestLogs(id: number) {
    this.isLoadingFailedIntegrationRequestsLog = true;
    this.failedIntegrationRequestService.getFailedIntegrationRequestLogs(id).subscribe({
      next: (res: Data<string>) => {
        this.failedIntegrationRequestsLogs = res.data;
        this.openFailedIntegrationRequestDialog();
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.data) {
          this.failedIntegrationRequestsLogs = err.data;
          this.openFailedIntegrationRequestDialog();
        }
      }
    }).add(() => this.isLoadingFailedIntegrationRequestsLog = false);
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.FAILED_INTEGRATION_REQUESTS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.FAILED_INTEGRATION_REQUESTS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.FAILED_INTEGRATION_REQUESTS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.FAILED_INTEGRATION_REQUESTS, columns, this.gridSettings);
  }

  private getFailedIntegrationRequests() {
    this.isLoading = true;
    this.failedIntegrationRequestService.getFailedIntegrationRequests().subscribe({
      next: (res: Data<FailedIntegrationRequest[]>) => {
        this.failedIntegrationRequests = res.data;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.isLoadingFailedIntegrationRequests = false;
    });
  }

  private prepareFailedIntegrationGridState(): GridState {
    return {
      columnConfig: [
        { field: 'status', title: 'Status', order: 0, type: ColumnType.TEXT },
        { field: 'startedAt', title: 'Started At', order: 1, type: ColumnType.DATE },
        { field: 'startedBy', title: 'Started By', order: 2, type: ColumnType.TEXT },
        { field: 'finishedAt', title: 'Finished At', order: 3, type: ColumnType.DATE },
        { field: 'Actions', title: 'Actions', order: 4, type: ColumnType.ACTION, width: 150 }
      ],
      state: this.state
    }
  }
}
