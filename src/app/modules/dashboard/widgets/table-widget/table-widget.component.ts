import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetTypeEnum } from '../../../../modules/dashboard/enums/dashboard.enum';
import { TableWidgetModel, WidgetModel } from '../../../../modules/dashboard/models/dashboard-model';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnInit {
  @Input() widget: WidgetModel;
  @Input() tableWidgetData: TableWidgetModel;
  keys: string[] = [];
  widgetTypeEnum = WidgetTypeEnum;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getKeys();
  }

  onRowClick(event: any) {
    if(this.widget?.detailsUrl && event?.dataItem && this.widget) {
      this.router.navigate(['/dashboard/widget-details'],
      {
        queryParams: {
          id: this.widget.id,
          detailsParameter: this.widget?.detailsParameter,
          detailsUrl: this.widget.detailsUrl,
          value: event?.dataItem[this.widget?.detailsParameter]
        }
      });
    }
  }

  private getKeys() {
    if (this.widget?.template === WidgetTypeEnum.TABLE && this.tableWidgetData?.table[0]) {
      this.keys = Object.keys(this.tableWidgetData.table[0]);
    }
  }
}