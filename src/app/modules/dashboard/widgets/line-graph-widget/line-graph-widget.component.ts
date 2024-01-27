import { Component, Input, OnInit } from '@angular/core';
import { LineGraphWidgetModel, WidgetModel } from '../../models/dashboard-model';

@Component({
  selector: 'app-line-graph-widget',
  templateUrl: './line-graph-widget.component.html',
  styleUrls: ['./line-graph-widget.component.scss']
})
export class LineGraphWidgetComponent implements OnInit {
  @Input() widget: WidgetModel;
  @Input() lineWidgetData: LineGraphWidgetModel;
  graphXAxis: string[] = [];
  graphLineData: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getXAxis();
    this.getGraphLineData();
  }

  private getXAxis(): void {
    if(this.lineWidgetData.keyAxeName) {
      this.graphXAxis = this.lineWidgetData?.lineChartTable.map((item) => item[this.lineWidgetData.keyAxeName]);
    }
  }

  private getGraphLineData(): void {
    if(this.lineWidgetData?.lineChartTable?.length > 0) {
      const keys = Object.keys(this.lineWidgetData.lineChartTable[0]).filter((key: string) => key !== this.lineWidgetData?.keyAxeName);
      keys.forEach((key: string) => {
        const values = this.lineWidgetData.lineChartTable.map(item => item[key]);
        this.graphLineData.push(values);
      });
    }
  }
}