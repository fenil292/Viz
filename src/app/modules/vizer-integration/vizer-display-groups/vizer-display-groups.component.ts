import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { BaseResponseModel } from '../../../shared/models/base-response.model';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { VizerDisplayGroups } from './models/vizer-display-group.model';
import { VizerDisplayGroupsApiService } from './services/vizer-display-groups-api.service';
import { VizerDisplayGroupsEntryComponent } from '../vizer-display-groups/vizer-display-groups-entry/vizer-display-groups-entry.component';
import { ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { pages } from '../../../shared/models/shared.model';
import { UtilityService } from '../../../shared/helpers/utility.service';

@Component({
  selector: 'app-vizer-display-groups',
  templateUrl: './vizer-display-groups.component.html',
  styleUrls: ['./vizer-display-groups.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class VizerDisplayGroupsComponent implements OnInit {
  path: any[] = ["Vizer Integration", "Vizer Display Groups"];
  index: string = "3.2";
  isLoading = true;
  vizerDisplayGroups: Array<VizerDisplayGroups> = [];
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };
  gridSettings: GridState;
  columnType = ColumnType;
  groupAlias: string[] = [];
  @ViewChild(TooltipDirective) tooltipDir: TooltipDirective;

  constructor(private vizerDisplayGroupsService: VizerDisplayGroupsApiService,
    private dialogService: DialogService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getVizerDisplayGroups();
    const defaultGridSettings = this.prepareVizerDisplayGroupGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.VIZER_DISPLAY_GROUPS, defaultGridSettings);
  }

  openVizerDisplayGroupDialog(dataItem: VizerDisplayGroups | undefined = undefined): void {
    const dialog = this.dialogService.open({ content: VizerDisplayGroupsEntryComponent });
    const data = dialog.content.instance as VizerDisplayGroupsEntryComponent;
    if (dataItem !== undefined) {
      data.id = dataItem.id;
    }
    dialog.result.subscribe((result) => {
      if (result['success']) {
        this.getVizerDisplayGroups();
      }
    })
  }

  onDeleteVizerDisplayGroup(id: number): void {
    this.confirmDialogService.openConfirmDialog("Confirmation", "Are you sure you want to delete selected vizer display group?")
      .subscribe((response: any) => {
        if (response.status) {
          this.deleteVizerDisplayGroup(id);
        }
      });
  }

  setCellColorByCode(colorCode: string): string {
    if (colorCode.startsWith('#')) {
      return `${colorCode}`;
    } else {
      return `#${colorCode}`;
    }
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.VIZER_DISPLAY_GROUPS, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.VIZER_DISPLAY_GROUPS, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.VIZER_DISPLAY_GROUPS, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.VIZER_DISPLAY_GROUPS, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }

  private getVizerDisplayGroups(): void {
    this.isLoading = true;
    this.vizerDisplayGroupsService.getVizerDisplayGroups().subscribe({
      next: (response: BaseResponseModel<Array<VizerDisplayGroups>>) => {
          this.vizerDisplayGroups = response.data;
          this.groupAlias = [...new Set(response.data?.filter(x => x.name !== '')?.map(x => x.name))];
      },
      error: (error) => this.notificationService.error(error)
    }).add(()=> this.isLoading = false);
  }

  private deleteVizerDisplayGroup(id: number): void {
    this.isLoading = true;
    this.vizerDisplayGroupsService.deleteVizerDisplayGroup(id).subscribe({
      next: (response: any) => {
        this.notificationService.success('Vizer display group has been deleted successfully.')
      },
      error: (error) => this.notificationService.error(error),
      complete: () => this.getVizerDisplayGroups()
    }).add(()=> this.isLoading = false);
  }

  private prepareVizerDisplayGroupGridState(): GridState {
    return {
      columnConfig: [
        { field: 'name', title: 'Group Alias', order: 0, type: ColumnType.TEXT },
        { field: 'description', title: 'Description', order: 1, type: ColumnType.TEXT },
        { field: 'Actions', title: 'Actions', order: 2, type: ColumnType.ACTION }
      ],
      state: this.state
    }
  }
}
