import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { WorkOrderLog } from './models/work-order-log.model';

@Component({
  selector: 'app-work-order-logs',
  templateUrl: './work-order-logs.component.html',
  styleUrls: ['./work-order-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderLogsComponent implements OnInit {
  workOrderLogs: WorkOrderLog[] = [];
  logs: string = '';
  workOrderNumber: string = '';

  constructor(
    private dialogRef: DialogRef,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.workOrderLogs?.forEach((log: WorkOrderLog) => {
      this.logs += this.datePipe.transform(log.timestamp, 'MM/dd/yyyy hh:mm:ss a') + ` ` + log.log + '\n';
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
