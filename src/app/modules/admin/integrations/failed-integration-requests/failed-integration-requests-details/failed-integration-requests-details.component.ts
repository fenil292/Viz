import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-failed-integration-requests-details',
  templateUrl: './failed-integration-requests-details.component.html',
  styleUrls: ['./failed-integration-requests-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FailedIntegrationRequestsDetailsComponent implements OnInit {
  failedIntegrationRequestsLogs: string = "";

  constructor(private dailogRef: DialogRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.dailogRef.close();
  }
}
