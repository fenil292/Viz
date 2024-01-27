
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() width: number = 560;
  @Input() cancelButtonText: string = "Cancel";
  @Input() confirmButtonText: string = "Delete";
  @Input() confirmButtonClass: string | undefined = undefined;

  constructor(public dialog: DialogRef) { }

  ngOnInit(): void {
    this.confirmButtonText = this.confirmButtonText ?? 'Delete';
  }

  public onCancel(): void {
    this.dialog.close({ status: false });
  }

  public onConfirm(): void {
    this.dialog.close({ status: true });
  }
}
