import { Injectable } from '@angular/core';
import { ScheduleTypeEnum, UnitEnum } from '../../modules/aps/aps-settings/constants/aps-settings.constants';

@Injectable({
  providedIn: 'root'
})
export class CronExpressionUtilityService {

  constructor() { }

  parseCronExpression(expression: string) {
    let selectedScheculeAPS = undefined;
    if (expression && expression !== "") {
      selectedScheculeAPS = { ScheduleType: "", value: "", SchedulePeriod: "" };
      const cronExpression = expression.split(' ');

      if (expression.includes("/")) {
        selectedScheculeAPS.ScheduleType = ScheduleTypeEnum.EVERY;
        if (cronExpression[1].includes("/")) {
          selectedScheculeAPS.SchedulePeriod = UnitEnum.MIN;
          selectedScheculeAPS.value = cronExpression[1];
        }
        else if (cronExpression[2].includes("/") && cronExpression[1] === "0") {
          selectedScheculeAPS.SchedulePeriod = UnitEnum.HOUR;
          selectedScheculeAPS.value = cronExpression[2];
        }

        selectedScheculeAPS.value = (parseInt(selectedScheculeAPS.value.split("/")[1]) ?? '');
      }
      else {
        selectedScheculeAPS.ScheduleType = ScheduleTypeEnum.EVERY_DAY_AT;
        const minute = parseInt(cronExpression[1]);
        const hour = parseInt(cronExpression[2]);
        if ((minute >= 0 && minute <= 59) && (hour >= 0 && hour <= 23)) {
          selectedScheculeAPS.value = new Date(0, 0, 0, hour, minute);
        }
      }
    }
    return selectedScheculeAPS;
  }

  generateCronExpression(scheduleType: ScheduleTypeEnum, value: any, unitType: UnitEnum | undefined = undefined) {
    let cronExpression: any[] = this.getDefaultCronExpression(scheduleType);
    if (scheduleType === ScheduleTypeEnum.EVERY) {
      if (unitType === UnitEnum.MIN) {
        cronExpression[1] = "*/" + value.toString();
      }
      else if (unitType === UnitEnum.HOUR) {
        cronExpression[1] = "0";
        cronExpression[2] = "*/" + value.toString();
      }
    }
    else if (scheduleType === ScheduleTypeEnum.EVERY_DAY_AT) {
      const minute = value.time.getMinutes();
      const hour = value.time.getHours();
      if ((minute >= 0 && minute <= 59) && (hour >= 0 && hour <= 23)) {
        cronExpression[1] = minute.toString();
        cronExpression[2] = hour.toString();
      }
    }
    return cronExpression.join(" ");
  }

  getDefaultCronExpression(scheduleType: ScheduleTypeEnum) {
    if (scheduleType === ScheduleTypeEnum.EVERY) {
      return ['0', '*', '*', '?', '*', '*'];
    }
    else if (scheduleType === ScheduleTypeEnum.EVERY_DAY_AT) {
      return ['0', '0', '0', '*', '*', '?'];
    }
  }
}
