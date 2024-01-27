import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { Data, Log, Pagging, pages } from '../../../../shared/models/shared.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { IntegrationsService } from './services/integrations.service';
import { DatasetsData } from './models/integrations.model';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UtilityService } from '../../../../shared/helpers/utility.service';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { ColumnType, GridState } from '../../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../../shared/helpers/state-persisting.service';
import {
  ColumnReorderEvent,
  ColumnResizeArgs,
  ColumnVisibilityChangeEvent,
  GridDataResult,
  PageChangeEvent
} from '@progress/kendo-angular-grid';
import { DefaultPageSize, DefaultPageSizes } from '../../../../shared/models/pagination-configuration.model';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatasetsComponent implements OnInit {
  path: string[] = ["Admin", "Integrations", "Datasets"];
  index: string = "5.1.2";
  datasets: GridDataResult;
  isLoading: boolean = false;
  isDatasetsLoading: boolean = false;
  isLoadingDatasetLog: boolean = false;
  state: State = {
    filter: {
      logic: 'and',
      filters: []
    },
    sort: [{dir: 'asc', field: 'status'}]
  };
  datasetLogs: Log[] | string | null = null;
  gridSettings: GridState;
  columnType = ColumnType;
  pageSizes = DefaultPageSizes;
  pagging: Pagging;
  skip: number = 0;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  constructor(
    private dialogService: DialogService,
    private integrationService: IntegrationsService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    const defaultGridSettings = this.prepareDataSetGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.DATASETS, defaultGridSettings);
    this.getPagingData();
    this.getDatasets();
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  getDataSetLogs(id: number) {
    this.isLoadingDatasetLog =true;
    this.integrationService.getDatasetLogs(id).subscribe({
      next: (res: Data<string>) => {
        this.datasetLogs = res.data;
        this.openDatasetLogsDialog();
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.data) {
          this.datasetLogs = err.data;
          this.openDatasetLogsDialog();
        }
      }
    }).add(() => this.isLoadingDatasetLog = false);
  }

  onReprocessDataSet(id: number) {
    this.isLoadingDatasetLog =true;
    this.integrationService.getReprocessDataSet(id).subscribe({
      next: (response: Data<any>) => {
        this.datasetLogs = response.logs;
        this.notificationService.success('Dataset has been reprocessed successfully.');
        this.openDatasetLogsDialog(true);
        this.getDatasets();
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.logs?.length > 0) {
          this.datasetLogs = err.logs;
          this.openDatasetLogsDialog(true);
        }
      }
    }).add(() => this.isLoadingDatasetLog = false);
  }

  openDatasetLogsDialog(isReprocessDataset: boolean = false) {
    const dialogRef = this.dialogService.open({
      content: DatasetDetailsComponent,
      actions: [],
      width: '700px',
      actionsLayout: 'normal',
      cssClass: 'dataset-log-dialog'
    });

    const data = dialogRef.content.instance as DatasetDetailsComponent;
    if(isReprocessDataset) {
      data.reProcessDatasetLogs = this.datasetLogs as Log[];
      data.title = "Dataset Logs";
      data.index = "5.1.2.2";
    }
    else {
      data.datasetLogs = this.datasetLogs as string;
      data.title = "Dataset Download Log";
      data.index = "5.1.2.1";
    }
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.DATASETS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.DATASETS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.DATASETS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.DATASETS, columns, this.gridSettings);
  }

  pageChange(event: PageChangeEvent) {
    if(this.pagging.pageSize !== event.take) {
      this.pagging.pageSize = event.take;
    }
    this.pagging.pageIndex = event.skip / this.pagging.pageSize;
    this.getDatasets();
  }

  sortChange(sort: SortDescriptor[]): void {
    this.pagging.sortColumn = sort[0]?.field;
    this.pagging.sortDirection = sort[0]?.dir;
    this.getDatasets();
  }

  private getDatasets() {
    this.isLoading = true;
    this.skip = this.pagging.pageIndex * this.pagging.pageSize;
    this.integrationService.getDatasets(this.pagging).subscribe({
      next: (res: Data<DatasetsData>) => {
        this.datasets = {
          data: res.data.datasets,
          total: res.data.totalItemsCount
        }
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.isDatasetsLoading = false;
    });
  }

  private prepareDataSetGridState(): GridState {
    return {
      columnConfig: [
        { field: 'sessionId', title: 'Session Id', order: 0, type: ColumnType.TEXT },
        { field: 'status', title: 'Status', order: 1, type: ColumnType.TEXT, width: 120 },
        { field: 'path', title: 'Path', order: 2, type: ColumnType.TEXT },
        { field: 'apsProcess', title: 'ApsProcess', order: 3, type: ColumnType.DATE, width: 160 },
        { field: 'createdAt', title: 'Created At', order: 4, type: ColumnType.DATE, width: 160 },
        { field: 'processStartedBy', title: 'Started By', order: 5, type: ColumnType.TEXT },
        { field: 'Actions', title: 'Actions', order: 6, type: ColumnType.ACTION, width: 150 }
      ],
      state: this.state
    }
  }

  private getPagingData() {
    let sortColumn = null, sortDirection = null;
    if(this.gridSettings.state?.sort[0]?.field && this.gridSettings.state?.sort[0]?.dir) {
      sortColumn = this.gridSettings.state.sort[0].field;
      sortDirection = this.gridSettings.state.sort[0].dir;
    }
    this.pagging = {
      pageIndex: 0,
      pageSize: DefaultPageSize,
      sortColumn: sortColumn ?? this.state.sort[0]?.field ?? "",
      sortDirection: sortDirection ?? this.state.sort[0]?.dir ?? ""
    }
  }
}
