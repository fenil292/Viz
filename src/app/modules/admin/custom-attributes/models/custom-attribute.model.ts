export class CustomAttribute {
    avaliableDatatypes: string[];
    attributes: Attribute[];
}

export class Attribute {
    name: string;
    attributes: AttributeModel[];
    persistFields: PersistField[];
}

export class AttributeModel {
    id: number;
    name: string;
    datatype: string;
    aps: boolean;
    matrixUI: boolean;
    hotSheet!: boolean;
}

export class PersistField {
    id: number;
    table: string;
    column: string;
    type: string;
    aps: boolean;
}