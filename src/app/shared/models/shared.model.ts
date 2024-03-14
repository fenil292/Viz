export class KeyValuePair {
    key: number;
    value: string;

    constructor(key: number, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class Data<T> {
    status!: string;
    message!: string | null;
    logs!: Log[] | string | null;
    data!: T
}

export class Log {
    status?: string;
    description?: string;
    timeStamp?: string;
}

export class CommonAttributeModel {
    customAttributeId: number;
    name: string;
    datatype: string;
    value: string;
}

export class Pagging {
    pageIndex: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: string;
}

export class LookUpItem {
    id: number;
    title: string;
    tag: string;
}

export const pages = {
    WORK_CENTERS: 'work-centers',
    WORK_ORDERS: 'work-orders',
    WORK_ORDER_OPERATIONS: 'work-order-operations',
    PART_INFO: 'part-info',
    SALES_ORDERS: 'sales-orders',
    PRIORITIES: 'priorities',
    APS_ISSUES: 'aps-issues',
    HOTSHEETS: 'hotsheets',
    DATASETS: 'datasets',
    FAILED_INTEGRATION_REQUESTS: 'failed-integration-requests',
    EXPORT: 'export',
    VIZER_DISPLAY_GROUPS: 'vizer-display-groups',
    WORK_RELATED_ILLNESS_AND_INJURIES: 'work-related-illness-and-injuries',
    WIDGET_DETAILS: 'widget-details'
}

export const CustomAttrbuteEntities = {
    Part: 'Part',
    SalesOrder: 'SalesOrder',
    WorkCenter: 'WorkCenter',
    WorkOrder: 'WorkOrder',
    WorkOrderOpeartion: 'WorkOrderOperation'
}