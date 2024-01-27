import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Data } from '../../../../shared/models/shared.model';
import { Priority } from '../models/priority.model';
import { PriorityService } from '../services/priority.service';
import { DialogRef } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-create-priority',
  templateUrl: './create-priority.component.html',
  styleUrls: ['./create-priority.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreatePriorityComponent implements OnInit {
  priorityForm!: FormGroup;
  isLoading: boolean = false;
  priorityId: number = 0;

  constructor(
    private dialog: DialogRef,
    private formBuilder: FormBuilder,
    private priorityService: PriorityService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getPriorityInfoById();
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  onSubmit() {
    this.priorityForm.markAllAsTouched();
    if(!this.priorityForm.invalid) {
      const data = this.priorityForm.getRawValue() as Priority;
      this.savePriorityInfo(data);
    }
  }

  onChangeColor() {
    if(!this.priorityForm.controls.color?.value) {
      this.priorityForm.controls.color.setValue('');
    }
  }

  private preparePriorityForm(priority: Priority | undefined = undefined) {
    this.priorityForm = this.formBuilder.group({
      id: [{value: (priority) ? priority.id : 0, disabled: true}],
      priorityCode: [(priority) ? priority.priorityCode : '', [Validators.required, Validators.maxLength(22)]],
      sequence: [(priority) ? priority.sequence : 0, Validators.required],
      viewableMessage: [(priority) ? priority.viewableMessage : '', Validators.maxLength(100)],
      color: [(priority) ? priority.color : ''],
      hotSheet: [(priority) ? priority.hotSheet : true],
      matrixUI: [{ value: (priority) ? priority.matrixUI : true, disabled: priority?.hotSheet === false}]
    });

    this.priorityForm.get("hotSheet").valueChanges.subscribe(value => {
      this.priorityForm.get("matrixUI").patchValue(value);
      if(value === false) {
        this.priorityForm.get("matrixUI")?.disable();
      } else {
        this.priorityForm.get("matrixUI")?.enable();
      }
    })
  }

  private savePriorityInfo(priority: Priority) {
    this.isLoading = true;
    this.priorityService.savePriorityInfo(priority).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success("Priority has been saved successfully.");
        this.dialog.close({ status: true });
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private getPriorityInfoById() {
    if(this.priorityId > 0) {
      this.isLoading = true;
      this.priorityService.getPriorityInfoById(this.priorityId).subscribe({
        next: (res: Data<Priority>) => {
          this.preparePriorityForm(res.data);
        },
        error: (err: any) => {
          this.notificationService.error(err);
        }
      }).add(() => this.isLoading = false);
    }
    else {
      this.preparePriorityForm();
    }
  }
}
