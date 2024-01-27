import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { WorkRelatedInjuriesEntryComponent } from './work-related-injuries-entry/work-related-injuries-entry.component';
import { WorkRelatedInjuryServiceService } from './services/work-related-injury-service.service';
import { EntryInitializeDataModel, WorkRelatedInjuryModel } from '../work-related-illness-and-injuries/models/work-related-injury.model';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { Data, KeyValuePair, pages } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';

@Component({
  selector: 'app-work-related-illness-and-injuries',
  templateUrl: './work-related-illness-and-injuries.component.html',
  styleUrls: ['./work-related-illness-and-injuries.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkRelatedIllnessAndInjuriesComponent implements OnInit {
  isLoading: boolean = false;
  path: string[] = ['Admin', 'Work Related Illness and Injuries'];
  index: string = '5.4';
  pageSizes = [25, 100, 500, 1000];
  pageSize = 25;
  showActionPopup: number;
  workrRelatedInjuryData: WorkRelatedInjuryModel[] = [];
  entryInitializeData: EntryInitializeDataModel;
  incidentOutcomeData: KeyValuePair[] = [];
  incidentTypeData: KeyValuePair[] = [];
  gridSettings: GridState;
  columnType = ColumnType;
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  constructor(
    private dialogService: DialogService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private statePersistingService: StatePersistingService,
    private workRelatedInjuryRecordSevice: WorkRelatedInjuryServiceService) {}

  ngOnInit(): void {
    this.getWorkRelatedInjuryData();
    this.getEntryInitializeData();
    const defaultGridSettings = this.prepareWorkRelatedInjuriesGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.WORK_RELATED_ILLNESS_AND_INJURIES, defaultGridSettings);
  }

  onCreateWorkRelatedIncidentRecord() {
    this.openWorkRelatedInjuryEntryDialog();
  }

  onEditWorkRelatedInjuryDataById(id: number) {
    this.openWorkRelatedInjuryEntryDialog(id);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  deleteWorkRelatedInjuryData(id: number) {
    this.isLoading = true;
    this.workRelatedInjuryRecordSevice.deleteWorkRelatedInjuryDataById(id).subscribe({
      next: (response: Data<WorkRelatedInjuryModel>) => {
        this.notificationService.success('Incident has been deleted successfully.');
        this.getWorkRelatedInjuryData();
        this.getEntryInitializeData();
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => (this.isLoading = false));
  }

  onDeleteWorkRelatedInjuryDataById(id: number): void {
    this.confirmDialogService
      .openConfirmDialog('Confirmation', 'Are you sure you want to delete this Incident?')  //24
      .subscribe((response: any) => {
        if (response.status) {
          this.deleteWorkRelatedInjuryData(id);
        }
    });
  }

  openWorkRelatedInjuryEntryDialog(id: number | undefined = undefined) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: WorkRelatedInjuriesEntryComponent,
      width: '60%',
      height: '90%',
      cssClass: 'work-related-injury-entry-dialog'
    });

    const data = dialogRef.content.instance as WorkRelatedInjuriesEntryComponent;
    data.incidentOutcomeData = this.incidentOutcomeData;
    data.incidentTypedata = this.incidentTypeData;
    data.entryInitializeWorkersNameData = this.entryInitializeData.workerNames;
    data.entryInitializeJobTitleData = this.entryInitializeData.jobTitles;

    if (id) {
      data.workrRelatedInjuryDataId = id;
    }

    dialogRef.result.subscribe((result: any) => {
      if (result?.status) {
        this.getWorkRelatedInjuryData();
        this.getEntryInitializeData();
      }
    });
  }

  getEntryInitializeData() {
    this.isLoading = true;
    this.workRelatedInjuryRecordSevice.getEntryInitializeData().subscribe({
      next: (response: Data<EntryInitializeDataModel>) => {
        this.entryInitializeData = response.data;
        this.getKeyValuePairArrayForIncidentOutCome();
        this.getKeyValuePairArrayForIncidentType();
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => (this.isLoading = false));
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.WORK_RELATED_ILLNESS_AND_INJURIES, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.WORK_RELATED_ILLNESS_AND_INJURIES, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.WORK_RELATED_ILLNESS_AND_INJURIES, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.WORK_RELATED_ILLNESS_AND_INJURIES, columns, this.gridSettings);
  }

  private getKeyValuePairArrayForIncidentOutCome() {
    const IncidentOutComeKey = Object.keys(this.entryInitializeData.incidentOutcome);
    this.incidentOutcomeData = [];
    if (IncidentOutComeKey?.length > 0) {
      IncidentOutComeKey.forEach((key: any) => {
        const keyValuePair: KeyValuePair = {
          key: key,
          value: this.entryInitializeData.incidentOutcome[key]
        };
        this.incidentOutcomeData.push(keyValuePair);
      });
    }
  }

  private getKeyValuePairArrayForIncidentType() {
    const IncidentTypeKey = Object.keys(this.entryInitializeData.incidentTypes);
    this.incidentTypeData = [];
    if (IncidentTypeKey?.length > 0) {
      IncidentTypeKey.forEach((key: any) => {
        const keyValuePair: KeyValuePair = {
          key: key,
          value: this.entryInitializeData.incidentTypes[key]
        };
        this.incidentTypeData.push(keyValuePair);
      });
    }
  }

  private getWorkRelatedInjuryData(searchValue: string = '') {
    this.isLoading = true;
    this.workRelatedInjuryRecordSevice.getWorkRelatedInjuryData(searchValue).subscribe({
      next: (response: Data<WorkRelatedInjuryModel[]>) => {
        this.workrRelatedInjuryData = response.data;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => (this.isLoading = false));
  }

  private prepareWorkRelatedInjuriesGridState(): GridState {
    return {
      columnConfig: [
        { field: 'workerName', title: "Worker's Name", order: 0, type: ColumnType.TEXT, width: 120 },
        { field: 'jobTitle', title: 'Job Title', order: 1, type: ColumnType.TEXT, width: 120 },
        { field: 'issueDate', title: 'Date of injury or onset of illness', order: 2, type: ColumnType.DATE, width: 120},
        { field: 'location', title: 'Location of Incident', order: 3, type: ColumnType.TEXT, width: 120 },
        { field: 'incidentOutcome', title: 'Incident Outcome', order: 4, type: ColumnType.TEXT, width: 140 },
        { field: 'days', title: '# Days Away from Work or Job Transfer', order: 5, type: ColumnType.NUMBER, width: 80 },
        { field: 'incidentType', title: 'Incident Type', order: 6, type: ColumnType.TEXT, width: 140 },
        { field: 'description', title: 'Describe Incident', order: 7, type: ColumnType.TEXT, width: 140 },
        { field: 'createdAt', title: 'Record Date', order: 8, type: ColumnType.DATE, width: 140 },
        { field: 'Actions', title: 'Actions', order: 9, type: ColumnType.ACTION, width: 140 }
      ],
      state: this.state
    };
  }
}
