export class Data<T> {
    status!: string;
    message!: string | null;
    logs!: string | null;
    data!: T
}

export class ProcessFlow {
    id!: number;
    name!: string;
    description!: string;
    enabled!: boolean;
    break!: boolean;
    default!: boolean;
    sequence!: number; 
    apsPriorityRule!: PriorityRule[];
    conditions!: Condition;
}

export class PriorityRule {
    id!: number;
    apsProcessFlowId!: number;
    description!: string;
    priorityInfoId!: number;
    priorityCode!: string;
    conditions!: Condition;
}

export class Condition {
    operator!: number;
    rules!: Rule[];
    groupRules!: Condition[];
}

export class Rule {
    table!: string;
    field!: string;
    comparison!: number;
    value!: string;
    type!: string;
    persist!: boolean;
    exist!: boolean;
}

export class ConditionBuild {
    tables: Table[];
    typeOperators: TypeOperator[];
}

export class Table {
    name!: string;
    fields!: Field[];
}

export class Field {
    name!: string;
    type!: string;
    isNull!: boolean;
    persist!: boolean;
}

export class TypeOperator {
    type!: string;
    isNull!: boolean;
    operators!: Operator[];
}

export class Operator {
    id!: number;
    name!: string;
}

export class WorkOrdersEmulateFlowRule {
  id: number;
  workOrderNumber!: string | null;
  partNumber: string;
  partRevision: string;
  requiredDate: string;
  requiredQuantity: number;
}

export class EmulateFlowRule {
  sql: string;
  datasetPath: string;
  workOrders: WorkOrdersEmulateFlowRule[];
}