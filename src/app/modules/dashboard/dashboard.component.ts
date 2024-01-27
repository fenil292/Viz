import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { WidgetModel, WidgetConfigModel } from '../dashboard/models/dashboard-model';
import { NotificationService } from '../../shared/services/notification.service';
import { UtilityService } from '../../shared/helpers/utility.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { Data } from '../../shared/models/shared.model';
import { WidgetTypeEnum } from './enums/dashboard.enum';
import { TileLayoutFlowMode, TileLayoutReorderEvent, TileLayoutResizeEvent } from '@progress/kendo-angular-layout';
import { LocalStorageUtilityService } from '../../shared/helpers/local-storage-utility.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  index: string = '6';
  path: string[] = ['Cadence'];
  isLoading = false;
  allWidgets: WidgetModel[] = [];
  widgets: WidgetConfigModel[] = [];
  autoFlow: TileLayoutFlowMode = 'none';
  defaultRowHeight: number = 216;
  columns: number = 12;
  @ViewChild('gridTooltip') tooltipDir: TooltipDirective;

  constructor(
    private utilityService: UtilityService,
    private dashboardService: DashboardService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageUtilityService) {}

  ngOnInit(): void {
    this.getAllWidgets();
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e, this.tooltipDir);
  }

  onChangeWidgetVisibility(data: any) {
    this.widgets = data;
    this.saveWidgets();
  }

  onReorder(event: TileLayoutReorderEvent) {
    if(event) {
      const oldWidgetIndex = this.widgets.find((widget: WidgetConfigModel) => widget.order === event.oldIndex);
      const newWidgetIndex = this.widgets.find((widget: WidgetConfigModel) => widget.order === event.newIndex);
      if(oldWidgetIndex && newWidgetIndex) {
        oldWidgetIndex.order = event.newIndex;
        newWidgetIndex.order = event.oldIndex;
      }
      this.saveWidgets();
    }
  }

  onResize(event: TileLayoutResizeEvent) {
    if(event) {
      let widget = this.widgets.find((widget: WidgetConfigModel) => widget.title === event.item.title);
      if(widget) {
        widget.colSpan = event.newColSpan;
        widget.rowSpan = event.newRowSpan;
      }
      this.saveWidgets();
    }
  }

  private getAllWidgets() {
    this.isLoading = true;
    this.dashboardService.getAllWidgets().subscribe({
      next: (response: Data<WidgetModel[]>) => {
        this.allWidgets = response.data;
        this.prepareAllWidgets();
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }
  
  private prepareAllWidgets(): void {
    const uniqueWidgets = [...new Set(this.allWidgets.map(item => item.group))];
    let index = 0;
    uniqueWidgets.forEach((groupName: any) => {
      const isGroup: boolean = groupName !== null ? true : false;
      let groupWidgets = this.allWidgets.filter((widget: any) => widget.group === groupName);
      if (isGroup) {
        if (groupWidgets.length > 0) {
          this.widgets.push({
            title: groupWidgets[0].group,
            isGroup: isGroup,
            visible: true,
            widgets: groupWidgets,
            rowSpan: 2,
            order: index++,
            colSpan: ((groupWidgets.length > 12) ? this.columns : (groupWidgets.length * 3))
          });
        }
      }
      else {
        groupWidgets.forEach(widget => {
          this.widgets.push({
            title: widget.name,
            isGroup: isGroup,
            visible: true,
            widgets: [widget],
            rowSpan: widget.template === WidgetTypeEnum.LINEGRAPH ? 2 : 1,
            order: index++,
            colSpan: this.getWidgetColSpan(widget.template)
          });
        });
      }
    });
    this.initializeWidgets();
  }

  private initializeWidgets(): void {
    let widgets = this.localStorageService.get(this.localStorageService.WIDGETS);
    if(widgets?.length > 0) {
      widgets = widgets.sort((a, b) => a.order - b.order);
      const widgetsClone = cloneDeep(this.widgets);
      this.widgets = [];
      widgets.forEach((widget: WidgetConfigModel) => {
        const widgetItem = widgetsClone.find((x: WidgetConfigModel) => x.title === widget.title);
        if(widgetItem) {
          this.widgets.push({
            ...widget,
            order: this.widgets.length,
            widgets: widgetItem.widgets
          });
        }
      });
      this.addNewWidgets(widgetsClone);
    }
    this.saveWidgets();
  }

  private addNewWidgets(widgets: WidgetConfigModel[]) {
    const newWidgets = widgets.filter((x: WidgetConfigModel) => !(this.widgets.some((item: WidgetConfigModel) => item.title === x.title)));
      if(newWidgets.length > 0) {
        newWidgets.forEach((newWidget: WidgetConfigModel) => {
          this.widgets.push({
            ...newWidget,
            order: this.widgets.length
          });
        });
      }
  }

  private saveWidgets(): void {
    this.widgets = this.widgets.sort((a, b) => a.order - b.order);
    this.localStorageService.add(this.localStorageService.WIDGETS, JSON.stringify(this.widgets));
  }

  private getWidgetColSpan(widgetType: string): number {
    if(widgetType === WidgetTypeEnum.TABLE || widgetType === WidgetTypeEnum.LINEGRAPH) {
      return 6;
    }
    return 1;
  }
}
