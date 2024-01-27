import { Component, Input, OnInit } from '@angular/core';
import { KeyValueWidgetModel, TableWidgetModel, WidgetModel } from '../../../../modules/dashboard/models/dashboard-model';
import { DashboardService } from '../../../../modules/dashboard/services/dashboard.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';
import { WidgetTypeEnum } from '../../../../modules/dashboard/enums/dashboard.enum';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-group-widget',
  templateUrl: './group-widget.component.html',
  styleUrls: ['./group-widget.component.scss']
})
export class GroupWidgetComponent implements OnInit {
  @Input() widgets: WidgetModel[] = [];
  widgetsData: any[] = [];
  isLoading: boolean = false;
  widgetTypeEnum = WidgetTypeEnum;

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getWidgetsData();
  }

  private getWidgetsData() {
    let requests = [];
    this.widgets?.forEach((widget: WidgetModel) => {
      requests.push(this.dashboardService.getWidgetDataUsingRequestUrl(widget.requestUrl, widget.id)
        .pipe(map((res) => res),
        catchError(error => {
            this.notificationService.error(error.message ?? error);
            return of (null);
          }
        )))
    });
    if(requests.length > 0) {
      this.isLoading = true;
      forkJoin(requests).subscribe({
        next:(res: any) => {
          res?.forEach((response: Data<KeyValueWidgetModel> | Data<TableWidgetModel>) => {
            if(response?.data) {
              this.widgetsData[response.data.id] = response.data;
            }
          });
        }
      }).add(() => this.isLoading = false);
    }
  }
}