import { Injectable } from '@angular/core';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialogService: DialogService) { }

  openConfirmDialog(title: string, message: string, confirmButtonText: string | undefined = undefined, confirmButtonClass: string | undefined = undefined): Observable<any> {
    const dialogRef = this.dialogService.open({
      content: ConfirmDialogComponent,
      title: (title ? title : "Confirmation"),
      width: 560,
      minWidth: 250,
      cssClass: "confirm-dialog-wrapper",
      preventAction: (ev, dialog) => {
        if (ev instanceof DialogCloseResult) {
          dialog.close({ status: false });
        }
        return false;
      },
    });

    const confirmDialog = dialogRef.content.instance as ConfirmDialogComponent;
    confirmDialog.message = message;
    confirmDialog.confirmButtonText = confirmButtonText;
    confirmDialog.confirmButtonClass = confirmButtonClass;
    return dialogRef.result;
  }
}
