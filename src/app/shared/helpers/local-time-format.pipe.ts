import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'localTimeFormat'
})
export class LocalTimeFormatPipe implements PipeTransform {

  constructor(private datepipe: DatePipe) { }

  transform(value: unknown, ...args: unknown[]): unknown {
    const dateFormat = args[0] as string;
    if(value && dateFormat) {
      let localTime: any = moment.utc(value).toDate();
      localTime = moment(localTime).local();
      return this.datepipe.transform(localTime, dateFormat);
    }
    return null;
  }
}
