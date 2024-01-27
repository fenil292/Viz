import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Data } from '../../../../shared/models/shared.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ExportChangeSet } from '../models/export.model';
import { ExportsService } from '../services/exports.service';

@Component({
  selector: 'app-export-changeset',
  templateUrl: './export-changeset.component.html',
  styleUrls: ['./export-changeset.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExportChangesetComponent implements OnInit {
  exportId: number;
  changesetId: string = '';
  isLoading: boolean = false;
  changeSet: ExportChangeSet;

  constructor(
    private dialog: DialogRef,
    private exportsService: ExportsService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getExportChangeSet();
  }

  onCancel() {
    this.dialog.close();
  }

  private getExportChangeSet() {
    this.isLoading = true;
    this.exportsService.getExportChangeSet(this.exportId).subscribe({
      next: (res: Data<ExportChangeSet>) => {
        this.changeSet = res.data;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }
}
