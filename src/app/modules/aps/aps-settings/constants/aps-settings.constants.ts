import { KeyValuePair } from '../../../../shared/models/shared.model';

export enum ScheduleTypeEnum {
    EVERY = 0,
    EVERY_DAY_AT = 1
}

export enum UnitEnum {
    MIN = 0,
    HOUR = 1
}

export const ScheduleTypes = [
    new KeyValuePair(ScheduleTypeEnum.EVERY,"Every"),
    new KeyValuePair(ScheduleTypeEnum.EVERY_DAY_AT,"Every day At")
];

export const Units = [
    new KeyValuePair(UnitEnum.MIN,"Minutes"),
    new KeyValuePair(UnitEnum.HOUR,"Hours"),
];
