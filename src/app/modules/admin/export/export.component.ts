import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { Data, pages } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { ExportChangesetComponent } from './export-changeset/export-changeset.component';
import { ExportLogsComponent } from './export-logs/export-logs.component';
import { Export } from './models/export.model';
import { ExportsService } from './services/exports.service';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';


@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExportComponent implements OnInit {
  path: string[] = ["Admin", "Export"];
  index: string = "5.2";
  exportData: Export[] = [];
  isLoading: boolean = false;
  isLoadingData: boolean = false;
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  @ViewChild(TooltipDirective) tooltipDir: TooltipDirective;

  constructor(
    private dialogService: DialogService,
    private utilityService: UtilityService,
    private exportsService: ExportsService,
    private notificationService: NotificationService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    const defaultGridSettings = this.prepareExportGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.EXPORT, defaultGridSettings);
    this.getExportData();
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }

  onExportLogs(data: Export) {
    this.getExportLogs(data);
  }

  onExportChangeSet(data: Export) {
    this.openExportChangeSet(data);
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.EXPORT, state, this.gridSettings);
  }

  private getExportData() {
    this.isLoadingData = true;
    this.exportsService.getExports().subscribe({
      next: (res: Data<Export[]>) => {
          this.exportData = res.data;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoadingData = false);
  }

  private getExportLogs(data: Export) {
    this.isLoading = true;
    this.exportsService.getExportLogs(data.id).subscribe({
      next: (res: Data<string>) => {
        this.openExportLogsDialog(data.changesetId, res.data);
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.data) {
          this.openExportLogsDialog(data.changesetId, err.data);
        }
      }
    }).add(() => this.isLoading = false);
  }

  private openExportLogsDialog(changeSet: string, logs: string | null) {
    const dialogRef = this.dialogService.open({
      content: ExportLogsComponent,
      actionsLayout: 'normal',
      cssClass: 'export-log-dialog'
    });

    const data = dialogRef.content.instance as ExportLogsComponent;
    data.logs = logs;
    data.title = `${changeSet} Logs`;
    data.index = '5.2.1';
  }

  private openExportChangeSet(exportInfo: Export) {
    const dialogRef = this.dialogService.open({
      content: ExportChangesetComponent,
      actionsLayout: 'normal',
      cssClass: 'export-changeset-dialog',
      width: '60%',
      height: '60%'
    });

    const data = dialogRef.content.instance as ExportChangesetComponent;
    data.exportId = exportInfo.id;
    data.changesetId = exportInfo.changesetId;
  }

  private prepareExportGridState(): GridState {
    return {
      columnConfig: [
        { field: 'changesetId', title: 'ChangeSet Id', order: 0, type: ColumnType.TEXT },
        { field: 'createdAt', title: 'Created', order: 1, type: ColumnType.DATE, width: 185 },
        { field: 'createdBy', title: 'Created By', order: 2, type: ColumnType.TEXT, width: 120 },
        { field: 'type', title: 'Type', order: 3, type: ColumnType.TEXT },
        { field: 'status', title: 'Status', order: 4, type: ColumnType.TEXT, width: 95 },
        { field: 'appliedAt', title: 'Applied', order: 5, type: ColumnType.DATE, width: 185 },
        { field: 'Actions', title: 'Actions', order: 6, type: ColumnType.ACTION, width: 140 }
      ],
      state: this.state
    }
  }
}
