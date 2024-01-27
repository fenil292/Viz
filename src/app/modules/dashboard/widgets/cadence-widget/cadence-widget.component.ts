import { Component, Input, OnInit } from '@angular/core';
import { WidgetTypeEnum } from '../../../../modules/dashboard/enums/dashboard.enum';
import { KeyValueWidgetModel, TableWidgetModel, WidgetModel } from '../../../../modules/dashboard/models/dashboard-model';
import { DashboardService } from '../../../../modules/dashboard/services/dashboard.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Data } from '../../../../shared/models/shared.model';

@Component({
  selector: 'app-cadence-widget',
  templateUrl: './cadence-widget.component.html',
  styleUrls: ['./cadence-widget.component.scss']
})
export class CadenceWidgetComponent implements OnInit {
  @Input() widget: WidgetModel;
  widgetData: any;
  isLoading: boolean = false;
  widgetTypeEnum = WidgetTypeEnum;
  
  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getWidgetData();
  }

  private getWidgetData() {
    this.isLoading = true;
    this.dashboardService.getWidgetDataUsingRequestUrl(this.widget?.requestUrl, this.widget?.id).subscribe({
      next: (res: Data<KeyValueWidgetModel> | Data<TableWidgetModel>) => {
        this.widgetData = res.data;
      },
      error: (error) => {
        this.notificationService.error(error.message ?? error);
      }
    }).add(() => this.isLoading = false);
  }
}