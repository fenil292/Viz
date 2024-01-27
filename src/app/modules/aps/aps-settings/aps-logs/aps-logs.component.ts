import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Log } from '../../../../shared/models/shared.model';

@Component({
  selector: 'app-aps-logs',
  templateUrl: './aps-logs.component.html',
  styleUrls: ['./aps-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApsLogsComponent implements OnInit {
  apsLogs: Log[] = [];
  logs: string = "";

  constructor(
    private dialogRef: DialogRef,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.apsLogs?.forEach((log: Log) => {
      this.logs += this.datePipe.transform(log.timeStamp, 'MM/dd/yyyy hh:mm:ss a') + ` [${log.status}] ` + log.description + '\n';
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
