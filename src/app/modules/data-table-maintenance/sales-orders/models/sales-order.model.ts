import { CommonAttributeModel } from "../../../../shared/models/shared.model";

export class SalesOrder {
    id: number;
    salesOrderNumber: string;
    requiredQty: number;
    requiredQtyUom: string;
    shipQty: number;
    shipQtyUom: string;
    requiredDate: string;
    allocatedQty: number;
    allocatedStockQty: number;
    partNumber: string;
    partRevision: string;
    partDescription: string;
    customerId: string;
    linkedWorkOrders: LinkedWorkOrders[];
    attributes: SalesOrderAttribue[];
}

export class LinkedWorkOrders {
    workOrderId: number;
    workOrderNumber: string;
    workOrderDueDate: string;
    workOrderRequiredQty: number;
    workOrderRequiredQtyUom: string | null;
    allocatedQty: number;
}

export class SalesOrderAttribue extends CommonAttributeModel {
    salesOrderAttributeId: number;
    salesOrderId: number;
}