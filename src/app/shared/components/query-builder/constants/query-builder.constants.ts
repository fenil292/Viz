export enum Operator {
    AND = 0,
    OR = 1,
}

export enum ComparisonOperator {
    Equal = 0,
    NotEqual = 1,
    Contain = 2,
    NotContain = 3,
    StartsWith = 4,
    EndsWith = 5,
    IsNull = 6,
    IsNotNull = 7,
    Grater = 8,
    GraterOrEqual = 9,
    Less = 10,
    LessOrEqual = 11,
    IsTrue = 12,
    IsFalse = 13
}

export const DataType = {
    NVARCHAR: 'nvarchar',
    STRING: 'string',
    BIT: 'bit',
    BOOLEAN: 'bool',
    DECIMAL: 'decimal',
    INT: 'int',
    DATETIME: 'datetime',
    URL: 'url'
}

export let operatorSymbols = {};
operatorSymbols[ComparisonOperator.Equal] = '=';
operatorSymbols[ComparisonOperator.NotEqual] = '<>';
operatorSymbols[ComparisonOperator.Grater] = '>';
operatorSymbols[ComparisonOperator.GraterOrEqual] = '>=';
operatorSymbols[ComparisonOperator.Less] = '<';
operatorSymbols[ComparisonOperator.LessOrEqual] = '<=';
