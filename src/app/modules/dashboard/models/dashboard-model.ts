import { KeyValuePair } from "../../../shared/models/shared.model";

export class WidgetModel {
  id: number;
  name: string;
  template: string;
  requestUrl: string;
  detailsUrl: string;
  detailsParameter: string;
  group: string;
}

export class TableWidgetModel {
  id: number;
  name: string;
  table: any[];
}

export class KeyValueWidgetModel {
  id: number;
  name: number;
  keyValues: KeyValuePair[];
}

export class LineGraphWidgetModel {
  id: number;
  name: string;
  keyAxeName: string;
  lineChartTable: any[];
}

export class WidgetConfigModel {
  title: string;
  isGroup: boolean;
  colSpan: number;
  rowSpan: number;
  visible: boolean;
  order: number;
  widgets: WidgetModel[];
}

export class TableWidgetDetails {
  caption: string;
  table: any[];
}