import { Injectable } from '@angular/core';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { ColumnSettings, ColumnType, GridState, PageState } from '../models/column-settings.model';
import { LocalStorageUtilityService } from './local-storage-utility.service';
import { UtilityService } from './utility.service';
import { startCase } from 'lodash';
import { AttributeModel } from '../../modules/admin/custom-attributes/models/custom-attribute.model';

@Injectable({
  providedIn: 'root'
})
export class StatePersistingService {
  constructor(
    private utilityService: UtilityService,
    private localStorageService: LocalStorageUtilityService) { }

  getGridSettings(pageName: string, defaultGridSettings: GridState | undefined = undefined) {
    const allPageGridSettings = this.getAllPageGridSettings();
    let gridSettings = allPageGridSettings?.find((x: any) => x.pageName === pageName)?.gridState ?? null;
    if(gridSettings && defaultGridSettings) {
      const isChange = this.isColumnConfigChange(defaultGridSettings, gridSettings);
      if(isChange) {
        gridSettings = defaultGridSettings;
      }
      gridSettings.columnConfig = gridSettings.columnConfig.sort((a, b) => a.order - b.order);
    } else {
      gridSettings = defaultGridSettings;
    }
    return gridSettings;
  }

  saveDataStateChange(pageName: string, state: State, gridSettings: GridState) {
    if(state.sort?.length > 0) {
      state.sort = state.sort.filter((sort: SortDescriptor) => sort?.dir !== undefined);
    }
    gridSettings.state = state;
    this.savePageGridSettings(pageName, gridSettings);
  }

  saveColumnOrder(pageName: string, columnReOrder: ColumnReorderEvent, gridSettings: GridState) {
    gridSettings.columnConfig.forEach((x: ColumnSettings) => {
      if(x.order === columnReOrder.oldIndex) {
        x.order = columnReOrder.newIndex;
      } 
      else if(x.order <= columnReOrder.newIndex && columnReOrder.newIndex > columnReOrder.oldIndex && x.order !== 0 && x.order > columnReOrder.oldIndex) {
        x.order -= 1;
      }
      else if(x.order >= columnReOrder.newIndex && columnReOrder.newIndex < columnReOrder.oldIndex && x.order !== gridSettings.columnConfig.length - 1 && x.order < columnReOrder.oldIndex) {
        x.order += 1;
      }
    });
    this.savePageGridSettings(pageName, gridSettings);
  }

  saveColumnWidth(pageName: string, columnResize: ColumnResizeArgs[], gridSettings: GridState) {
    const column = gridSettings.columnConfig.find((x: ColumnSettings) => x.field === columnResize[0].column['field']);
    if(column) {
      column.width = columnResize[0].newWidth;
    }
    this.savePageGridSettings(pageName, gridSettings);
  }

  saveColumnsVisibility(pageName: string, columns: ColumnVisibilityChangeEvent, gridSettings: GridState) {
    columns?.columns?.forEach((item: any) => {
      const column = gridSettings.columnConfig.find((x: ColumnSettings) => x.field === item.field);
      if(column) {
        column.hidden = item.hidden;
      }
    });
    this.savePageGridSettings(pageName, gridSettings);
  }

  saveCustomAttributesColumns(pageName: string, values: string[], attributes: any[], gridSettings: GridState) {
    let columns: ColumnSettings[] = [];
    gridSettings.columnConfig = gridSettings.columnConfig.sort((a, b) => a.order - b.order);
    let actionColumn = gridSettings?.columnConfig.find((column: ColumnSettings) => column.type === ColumnType.ACTION);
    gridSettings?.columnConfig?.forEach((column: ColumnSettings) => {
      if(column.type !== ColumnType.ACTION) {
        column.order = columns.length;
        if(column.isCustomAttribute) {
          const attribute = attributes.find((x: any) => x.name === column.field);
          if(values.includes(column.field) && attribute) {
            columns.push(column);
          }
        } else {
          columns.push(column);
        }
      }
    });

    values.forEach((attributeName: string) => {
      const index = columns.findIndex((item: ColumnSettings) => item.field === attributeName);
      if(index === -1) {
        const attribute = attributes.find((x: any) => x.name === attributeName);
        if(attribute) {
          const column: ColumnSettings = {
            field: attribute.name,
            order: columns.length,
            title: startCase(attribute.name),
            type: this.utilityService.getColumnTypeByType(attribute.datatype),
            hidden: false,
            isCustomAttribute: true,
            customAttributeId: attribute?.id
          }
          columns.push(column);
        }
      }
    });

    if(actionColumn) {
      actionColumn.order = columns.length;
      columns.push(actionColumn);
    }

    gridSettings.columnConfig = columns;
    this.removeDeletedAttributeFilterAndSort(gridSettings);
    this.savePageGridSettings(pageName, gridSettings);
  }

  addCustomAttributesColumns(pageName: string, columnNames: string[], gridSettings: GridState) {
    let columns: ColumnSettings[] = [];
    gridSettings.columnConfig = gridSettings.columnConfig.sort((a, b) => a.order - b.order);
    gridSettings.columnConfig.forEach((column: ColumnSettings) => {
      const isColumnExist = columns.find((item: ColumnSettings) => item.field === column.field);
      if((columnNames.includes(column.field) || column.type === ColumnType.SELECTABLE_CHECKBOX) && !isColumnExist) {
        column.order = columns.length;
        columns.push(column);
      }
    });
    columnNames.forEach((columnName: string) => {
      const isColumnExist = columns.find((column: ColumnSettings) => column.field === columnName);
      if(!isColumnExist) {
        const column: ColumnSettings = {
          field: columnName,
          order: columns.length,
          title: startCase(columnName),
          type: ColumnType.TEXT,
          hidden: false,
          isCustomAttribute: true
        }
        columns.push(column);
      }
    });

    gridSettings.columnConfig = columns;
    this.removeDeletedAttributeFilterAndSort(gridSettings);
    this.savePageGridSettings(pageName, gridSettings);
  }

  updateAttributeColumnName(pageName: string, gridSettings: GridState, attributes: AttributeModel[]) {
    let isChange = false;
    gridSettings.columnConfig.forEach((column: ColumnSettings) => {
      if(column.isCustomAttribute) {
        const attribute = attributes.find((x: AttributeModel) => x.id === column.customAttributeId);
        if(attribute) {
          const attributeColumnType = this.utilityService.getColumnTypeByType(attribute.datatype);
          if(attribute.name !== column.field || column.type !== attributeColumnType) {
            isChange = true;
            column.field = attribute.name;
            column.title = startCase(attribute.name);
            column.type = attributeColumnType;
          }
        } else {
          isChange = true;
        }
      }
    });
    let customAttributeAsColumns = gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);

    if(isChange) {
      this.saveCustomAttributesColumns(pageName, customAttributeAsColumns, attributes, gridSettings);
    }

    return customAttributeAsColumns;
  }

  private getAllPageGridSettings() {
    return this.localStorageService.get(this.localStorageService.PAGES_STATE);
  }

  private savePageGridSettings(name: string, gridState: GridState) {
    let allPageGridSettings: PageState[] = []
    allPageGridSettings = this.getAllPageGridSettings() ?? [];
    let gridSettings = allPageGridSettings?.find((x: any) => x.pageName === name);
    if(gridSettings) {
      gridSettings.gridState = gridState;
    } else {
      allPageGridSettings.push({ pageName: name, gridState: gridState});
    }
    this.localStorageService.add(this.localStorageService.PAGES_STATE, JSON.stringify(allPageGridSettings));
  }

  private isColumnConfigChange(defaultGridSettings: GridState, currentGridSettings: GridState) {
    let defaultGridColumns = defaultGridSettings.columnConfig.map(x => ({ title: x.title, field: x.field, type: x.type}));
    let currentGridColumns = currentGridSettings.columnConfig.filter(x => !x.isCustomAttribute).map(x => ({ title: x.title, field: x.field, type: x.type}));
    defaultGridColumns = this.sortColumnByField(defaultGridColumns);
    currentGridColumns = this.sortColumnByField(currentGridColumns);
    return !this.utilityService.compareArrays(defaultGridColumns, currentGridColumns);
  }

  private sortColumnByField(columns: any[]) {
    return columns.sort((a, b) => a.field < b.field ? -1 : 1);
  }

  private removeDeletedAttributeFilterAndSort(gridSettings: GridState) {
    let filters: any[] = [];
    if(gridSettings.state.filter?.filters?.length > 0) {
      gridSettings.state.filter.filters.forEach((filter: any) => {
        if(filter?.filters?.length > 0) {
          const isColumnExist = gridSettings.columnConfig.find((column: ColumnSettings) => column.field === filter.filters[0].field);
          if(isColumnExist) {
            filters.push(filter);
          }
        }
      });
      gridSettings.state.filter.filters = filters;
    }

    let sortColumns: SortDescriptor[] = [];
    if(gridSettings.state.sort?.length > 0) {
      gridSettings.state.sort.forEach((item: SortDescriptor) => {
        const isColumnExist = gridSettings.columnConfig.find((column: ColumnSettings) => column.field === item.field);
        if(isColumnExist) {
          sortColumns.push(item);
        }
      });
      gridSettings.state.sort = sortColumns;
    }
  }
}
