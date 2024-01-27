import {AttributeModel} from '../../../modules/admin/custom-attributes/models/custom-attribute.model';

export class HotsheetsModel {
    id: number;
    priorityCode: string;
    priorityColor: string;
    priorityViewableMessage: string | null;
    publishDateTime: string;
    dueDate: string;
    dueDateCaption: string;
    workOrderNumber: string;
    salesOrderNumber: string;
    salesOrderDueDate: string;
    partNumber: string;
    partRev: string;
    partDescription: string;
    quantity: number;
    quantityUom: string | null;
    criticalConstraint: string;
    quantityOnHand: number;
    alternativeConstraints: string;
    hotSheetOperationNumbers: string;
    workOrderId: number;
    salesOrderId: number;
}

export class HotSheetListModel {
  hotSheets: HotsheetsModel[];
  customerAttributes: AttributeModel[];
}