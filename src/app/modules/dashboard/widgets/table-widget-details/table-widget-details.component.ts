import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from '@progress/kendo-data-query';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { TableWidgetDetails } from '../../../../modules/dashboard/models/dashboard-model';
import { DashboardService } from '../../../../modules/dashboard/services/dashboard.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Data, pages } from '../../../../shared/models/shared.model';
import { ColumnType, GridState } from '../../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../../shared/helpers/state-persisting.service';
import { UtilityService } from '../../../../shared/helpers/utility.service';

@Component({
  selector: 'app-table-widget-details',
  templateUrl: './table-widget-details.component.html',
  styleUrls: ['./table-widget-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableWidgetDetailsComponent implements OnInit {
  index: string = '6.1';
  path: string[] = ['Widget Details: '];
  widgetDetails: TableWidgetDetails;
  detailsParameter: string;
  detailsUrl: string;
  value: string;
  id: number;
  isLoading: boolean = false;
  gridSettings: GridState;
  pageName: string = pages.WIDGET_DETAILS;
  state: State = <State>{
    filter: {
      logic: 'and',
      filters: []
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private dashboardService: DashboardService,
    private notificationService: NotificationService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if(params['id'] !== undefined && params['detailsParameter'] !== undefined && params['detailsUrl'] !== undefined && params['value'] !== undefined) {
        this.id = params['id'];
        this.pageName += ('-' + this.id);
        this.detailsParameter = params['detailsParameter'];
        this.detailsUrl = params['detailsUrl'];
        this.value =  params['value'];
        this.getWidgetDetails();
      }
    });
  }
  
  onRefresh() {
    this.getWidgetDetails();
  }

  cancel(): void {
    this.router.navigateByUrl('/dashboard');
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(this.pageName, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(this.pageName, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(this.pageName, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(this.pageName, columns, this.gridSettings);
  }

  showTooltip(e: MouseEvent, tooltip: any): void {
    this.utilityService.showTooltip(e, tooltip);
  }

  private getWidgetDetails() {
    this.isLoading = true;
    const queryParams = `${this.id}/${this.detailsParameter}/${this.value}`;
    this.dashboardService.getWidgetDetails(this.detailsUrl, queryParams).subscribe({
      next: (res: Data<TableWidgetDetails>) => {
        if(res.data) {
          this.widgetDetails = res?.data;
          this.path = ['Widget Details: ' + res.data.caption];
          const defaultGridSettings = this.prepareWidgetGridState();
          this.gridSettings = this.statePersistingService.getGridSettings(this.pageName, defaultGridSettings);
        }
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareWidgetGridState(): GridState {
    const columnConfig = [];
    if(this.widgetDetails?.table[0]) {
      const keys = Object.keys(this.widgetDetails.table[0]);
      keys?.forEach((key: string, index: number) => {
        columnConfig.push({
          field: key,
          title: key,
          order: index,
          type: ColumnType.TEXT
        });
      });
    }
    return {
      columnConfig: columnConfig,
      state: this.state
    }
  }
}