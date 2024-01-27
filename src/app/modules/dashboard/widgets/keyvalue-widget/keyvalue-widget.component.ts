import { Component, Input } from '@angular/core';
import { WidgetTypeEnum } from '../../../../modules/dashboard/enums/dashboard.enum';
import { KeyValueWidgetModel, WidgetModel } from '../../../../modules/dashboard/models/dashboard-model';

@Component({
  selector: 'app-keyvalue-widget',
  templateUrl: './keyvalue-widget.component.html',
  styleUrls: ['./keyvalue-widget.component.scss']
})
export class KeyvalueWidgetComponent {
  @Input() widget: WidgetModel;
  @Input() keyValueWidgetData: KeyValueWidgetModel;
  widgetTypeEnum = WidgetTypeEnum;

  constructor() {}

  setTitleBackgroundColorByName(item: any) {
    if (item === 'Today') {
      return 'today-color';
    }
    if (item === 'Yesterday') {
      return 'yesterday-color';
    }
    if (item === 'Tomorrow') {
      return 'tomorrow-color';
    }
    else {
      return '';
    }
  }
}