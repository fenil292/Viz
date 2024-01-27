import { CommonAttributeModel } from "../../../../shared/models/shared.model";

export class Part {
    id: number;
    partNumber: string;
    partDescription: string;
    partRevision: string;
    stockQuantity: number;
    stockQuantityUom: string;
}

export class PartAttribute extends CommonAttributeModel {
    partId: number;
    partAttributeId: number;
}