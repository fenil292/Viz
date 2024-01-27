import { State } from "@progress/kendo-data-query";

export class ColumnSettings {
    field: string;
    title: string;
    width?: number;
    order: number;
    type: number;
    hidden?: boolean = false;
    isCustomAttribute?: boolean = false;
    customAttributeId?: number;
}

export class GridState {
    columnConfig: ColumnSettings[];
    state: State = {
        filter: {
          logic: 'and',
          filters: []
        },
        sort: []
    };
}

export class PageState {
    pageName: string;
    gridState: GridState;
}

export enum ColumnType {
    TEXT = 0,
    NUMBER = 1,
    DATE = 3,
    COLOR = 4,
    CHECKBOX = 5,
    ACTION = 6,
    SELECTABLE_CHECKBOX = 7,
    URL = 8
}