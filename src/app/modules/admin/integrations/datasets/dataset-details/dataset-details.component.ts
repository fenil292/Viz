import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Log } from '../../../../../shared/models/shared.model';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatasetDetailsComponent implements OnInit {
  datasetLogs: string = "";
  reProcessDatasetLogs: Log[] = [];
  index: string | null = null;
  title: string | null = null;

  constructor(
    private dialogRef: DialogRef,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.reProcessDatasetLogs?.forEach((log: Log) => {
      this.datasetLogs += this.datePipe.transform(log.timeStamp, 'MM/dd/yyyy hh:mm:ss a') + ` [${log.status}] ` + log.description + '\n';
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
