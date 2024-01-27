import { CommonAttributeModel } from "../../../../shared/models/shared.model";

export interface WorkOrderOperationModel {
    id: number;
    process: string;
    step: number;
    workCenter: string;
    priority: string;
    status: string;
    manualPriority: boolean;
    attributes: WorkOrderOperationAttribute[];
}

export class LinkedSalesOrders {
    salesOrderId: number;
    salesOrderNumber: string;
    salesOrderRequiredDate: string;
    salesOrderRequiredQty: number;
    salesOrderRequiredQtyUom: string;
    shipQty: number;
    shipQtyUom: string;
    allocatedQty: number;
}

export class WorkOrderOperationAttribute extends CommonAttributeModel {
    workOrderOperationAttributeId: number;
    workOrderNumber: string;
    workOrderOperationId: number;
}