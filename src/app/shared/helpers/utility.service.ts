import { Injectable } from '@angular/core';
import { isEqual, toNumber } from 'lodash';
import { DatePipe } from '@angular/common';
import { DataType } from '../components/query-builder/constants/query-builder.constants';
import { ColumnType } from '../models/column-settings.model';

@Injectable({
  providedIn: 'root'
})

export class UtilityService {

  constructor(private datePipe: DatePipe) { }

  showTooltip(e: MouseEvent, tooltipDir: any): void {
    const element = e.target as HTMLElement;
    let kCellInner = element.closest(".k-cell-inner") ? element.closest(".k-cell-inner").querySelector('.k-column-title') : undefined;
    if (element.classList.contains('k-column-title')) {
      tooltipDir.position = "bottom";
    } else {
      tooltipDir.position = "top";
    }
    if ((element?.nodeName === "TD" || element?.nodeName === "TH") && element?.offsetWidth < element?.scrollWidth) {
      tooltipDir.toggle(element);
    }
    else if (element?.offsetParent?.className?.includes('k-header k-filterable')
      && !element?.classList?.contains('k-grid-column-menu')
      && !element?.classList?.contains('k-icon')
      && !element?.classList?.contains('k-link')
      && !element?.classList?.contains('k-cell-inner')
      && (kCellInner && (kCellInner as any)?.offsetWidth < kCellInner?.scrollWidth)) {
      tooltipDir.toggle(element);
    }
    else {
      if(element?.classList?.contains('data-value') !== true) {
        tooltipDir.hide();
      }
    }
  }

  compareArrays(array1: any[], array2: any[]) {
    return isEqual(array1, array2);
  }

  getValueByType(value: any, type: any) {
    let result: any = null;
    if (value != undefined && value != null) {
      switch (type) {
        case DataType.STRING:
        case DataType.URL:
          result = value;
          break;
        case DataType.DATETIME:
          if (value && isNaN(toNumber(value))) {
            result = new Date(value);
          }
          break;
        case DataType.INT:
          if (!isNaN(toNumber(value))) {
            result = parseInt(toNumber(value).toString());
          }
          break;
        case DataType.DECIMAL:
          if (!isNaN(toNumber(value))) {
            result = toNumber(value);
          }
          break;
        case DataType.BOOLEAN:
          if (value === 'true' || value === 'false') {
            result = value === 'true' ? true : false;
          }
          break;
        default:
          result = value;
          break;
      }
    }
    return result;
  }

  getColumnTypeByType(type: string) {
    let columnType: any = ColumnType.TEXT;
    switch (type) {
      case DataType.STRING:
      case DataType.INT:
      case DataType.DECIMAL:
        columnType = ColumnType.TEXT;
        break;
      case DataType.URL:
        columnType = ColumnType.URL;
        break;
      case DataType.DATETIME:
        columnType = ColumnType.DATE;
        break;
      case DataType.BOOLEAN:
        columnType = ColumnType.CHECKBOX;
        break;
      default:
        columnType = ColumnType.TEXT;
        break;
    }
    return columnType;
  }

  convertValueTypeToString(type: string, value: string) {
    if(value !== undefined && value !== null) {
      if(type === DataType.DATETIME) {
        return this.getDateOnlyFromValue(value);
      } else {
        return value?.toString();
      }
    }
    return null;
  }

  private getDateOnlyFromValue(value: any) {
    return this.datePipe.transform(value, 'yyyy-MM-ddT00:00:00');
  }
}
