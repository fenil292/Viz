import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { EmulateFlowRule } from '../models/processflow.model';
import { LocalTimeFormatPipe } from '../../../../shared/helpers/local-time-format.pipe';
import { Log } from '../../../../shared/models/shared.model';

@Component({
  selector: 'app-proces-flow-troubleshoot',
  templateUrl: './proces-flow-troubleshoot.component.html',
  styleUrls: ['./proces-flow-troubleshoot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProcesFlowTroubleshootComponent implements OnInit {
  emulateFlowRule: EmulateFlowRule;
  logs: string = '';
  priorityCode: string;
  emalutedFlowRuleLogs: Log[] = [];

  constructor(
    public dialog: DialogRef,
    private localTimeFormatPipe: LocalTimeFormatPipe) { }

  ngOnInit(): void {
    this.emalutedFlowRuleLogs?.forEach((log: Log) => {
      this.logs += this.localTimeFormatPipe.transform(log.timeStamp, 'MM/dd/yyyy hh:mm:ss a') + ` [${log.status}] ` + log.description + '\n';
    });
  }

  onCancel() {
    this.dialog.close({ status: false });
  }
}
