import { LookUpItem } from '../../../../shared/models/shared.model';

export interface VizerDisplayGroups {
    id: number;
    name: string;
    description: string;
    sortOrderId: number;
    workCenterIds: number[];
    workCenters: LookUpItem[];
    sortOrders: LookUpItem[];
}