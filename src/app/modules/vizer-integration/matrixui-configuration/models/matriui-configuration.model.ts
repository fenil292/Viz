import { LookUpItem } from "../../../../shared/models/shared.model";

export class MatrixUIConfiguration {
    backgroundBlinking: number;
    sortOrderId: number;
    colorSchemaItems: ColorSchemaItems[];
    sortOrders: LookUpItem[];
}

export class ColorSchemaItems {
    id: number;
    name: string;
    background: string;
    foreground: string;
    threshold: number;
}