import { CommonAttributeModel } from "../../../../shared/models/shared.model";
import { LinkedSalesOrders, WorkOrderOperationModel } from "../../work-order-operations/models/work-order-operation.model";

export interface WorkOrderModel {
    id: number;
    priorityCode: string;
    workOrderNumber: string;
    partNumber: string;
    partRevision: string;
    partDescription: string;
    salesOrderNumber: string;
    customerId: string;
    requiredDate: Date;
    totalPrice: number;
    quantityUom?: number;
    requiredQuantity: number;
    processDate?: Date;
    workOrderOperations?: Array<WorkOrderOperationModel>;
    salesOrderDueDate?: string;
    linkedSalesOrders?: LinkedSalesOrders[];
    attributes?: WorkOrderAttribute[];
}

export class WorkOrderAttribute extends CommonAttributeModel {
    workOrderAttributeId: number;
    workOrderNumber: string;
    workOrderId: number;
}