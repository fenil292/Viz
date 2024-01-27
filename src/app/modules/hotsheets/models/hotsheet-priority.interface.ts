export interface HotsheetPriorityModel {
    aps: boolean;
    color: string;
    hotSheet: boolean;
    id: number;
    priorityCode: string;
    quantityUom: string;
    sequence: number;
    stockQuantity: number;
    viewableMessage: string;
}

export interface HotsheetPriorityShortModel {
    id: number;
    value: string;
}