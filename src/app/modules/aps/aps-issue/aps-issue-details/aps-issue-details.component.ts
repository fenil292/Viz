import { Component, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { ApsIssue } from '../models/aps-issue.model';

@Component({
  selector: 'app-aps-issue-details',
  templateUrl: './aps-issue-details.component.html',
  styleUrls: ['./aps-issue-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApsIssueDetailsComponent {
  apsIssueDetail: ApsIssue | undefined = undefined;

  constructor(private dialogRef: DialogRef) { }

  onCancel() {
    this.dialogRef.close();
  }
}
