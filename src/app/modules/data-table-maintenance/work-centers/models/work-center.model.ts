import { CommonAttributeModel } from "../../../../shared/models/shared.model";

export class WorkCenterModel {
    id: number;
    workCenterId: string;
    alias: string;
    description: string;
    color: string;
    fontColor: string;
    criticalConstraint: boolean;
    vizerDisplayGroupIds: number[];
    attributes: WorkCenterAttribute[];
}

export class WorkCenterAttribute extends CommonAttributeModel {
    workCenterAttributeId: number;
    workCenterId: string;
}