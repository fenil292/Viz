import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Log } from '../../../../shared/models/shared.model';
import { LocalTimeFormatPipe } from '../../../../shared/helpers/local-time-format.pipe';

@Component({
  selector: 'app-export-logs',
  templateUrl: './export-logs.component.html',
  styleUrls: ['./export-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExportLogsComponent implements OnInit {
  exportLogs: Log[] = [];
  logs: string = '';
  index: string | null = null;
  title: string | null = null;

  constructor(
    private dialogRef: DialogRef,
    private localTimeFormatPipe: LocalTimeFormatPipe) { }

  ngOnInit() {
    this.exportLogs?.forEach((log: Log) => {
      this.logs += this.localTimeFormatPipe.transform(log.timeStamp, 'MM/dd/yyyy hh:mm:ss a') + ` [${log.status}] ` + log.description + '\n';
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
