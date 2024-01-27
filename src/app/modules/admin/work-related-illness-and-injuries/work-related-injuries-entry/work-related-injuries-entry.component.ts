import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { EntryInitializeDataModel, WorkRelatedInjuryModel } from '../models/work-related-injury.model';
import { Data, KeyValuePair } from '../../../../shared/models/shared.model';
import { IncidentOutcomeEnum } from '../enums/work-related-injury-record.enum';
import { WorkRelatedInjuryServiceService } from '../services/work-related-injury-service.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-work-related-injuries-entry',
  templateUrl: './work-related-injuries-entry.component.html',
  styleUrls: ['./work-related-injuries-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkRelatedInjuriesEntryComponent implements OnInit {
  addNewRecordForm!: FormGroup;
  isLoading: boolean = false;
  incidentOutcomeEnum = IncidentOutcomeEnum;
  workrRelatedInjuryDataId: number = 0;
  incidentOutcomeData : KeyValuePair[] = [];
  incidentTypedata : KeyValuePair[] = [];
  entryInitializeWorkersNameData : string[] = [];
  entryInitializeJobTitleData : string[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains",
  };

  constructor(
    private dialog: DialogRef,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private workRelatedInjuryRecordSevice: WorkRelatedInjuryServiceService) {}

  ngOnInit(): void {
    this.prepareWorkRelatedInjuryIllnessEntryForm();
    this.getWorkRelatedInjuryRecordById();
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  onSubmit(){
    this.addNewRecordForm.markAllAsTouched();
    if(!this.addNewRecordForm.invalid) {
      const data = this.addNewRecordForm.getRawValue() as WorkRelatedInjuryModel;
      this.saveWorkRelatedInjury(data);
    }
  }

  private prepareWorkRelatedInjuryIllnessEntryForm(injuryRecord: WorkRelatedInjuryModel | undefined = undefined) {
    this.addNewRecordForm = this.formBuilder.group({
      id: [{value: (injuryRecord) ? injuryRecord.id : 0, disabled: true}],
      workerName: [(injuryRecord) ? injuryRecord.workerName : '', [Validators.required, Validators.maxLength(500)]],
      jobTitle: [(injuryRecord) ? injuryRecord.jobTitle : '', [Validators.required, Validators.maxLength(250)]],
      issueDate: [(injuryRecord) ? new Date(injuryRecord.issueDate) : null , [Validators.required]],
      location: [(injuryRecord) ? injuryRecord.location : '', [Validators.required]],
      incidentType: [(injuryRecord) ? injuryRecord.incidentType : '', [Validators.required]],
      incidentOutcome: [(injuryRecord) ? injuryRecord.incidentOutcome : '', [Validators.required]],
      days: [(injuryRecord) ? injuryRecord.days : null, []],
      description: [(injuryRecord) ? injuryRecord.description : '']
    });

    this.addNewRecordForm.get('incidentOutcome').valueChanges.subscribe(value => {
        if(value === IncidentOutcomeEnum.DAYSAWAYFROMWORK || value === IncidentOutcomeEnum.JOBTRANSFERORRESTRICTION) {
          this.addNewRecordForm.get('days').setValidators(Validators.required);
        } else {
          this.addNewRecordForm.get('days').clearValidators();
          this.addNewRecordForm.get('days')?.patchValue(null);
        }
        this.addNewRecordForm.controls['days'].updateValueAndValidity();
     }
   );
  }

  private saveWorkRelatedInjury(WorkRelatedInjuryRecord: WorkRelatedInjuryModel){
    this.isLoading = true;
    this.workRelatedInjuryRecordSevice.saveWorkRelatedInjury(WorkRelatedInjuryRecord).subscribe({
      next: (response: Data<number>) => {
        this.notificationService.success("Incident has been saved succesfully");
        this.dialog.close({ status: true });
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private getWorkRelatedInjuryRecordById() {
    if(this.workrRelatedInjuryDataId > 0) {
      this.isLoading = true;
      this.workRelatedInjuryRecordSevice.getWorkrelatedInjuryDataById(this.workrRelatedInjuryDataId).subscribe({
        next: (respone: Data<WorkRelatedInjuryModel>) => {
          this.prepareWorkRelatedInjuryIllnessEntryForm(respone.data);
        },
        error: (err: any) => {
          this.notificationService.error(err);
        }
      }).add(() =>this.isLoading = false);
    }
    else {
      this.prepareWorkRelatedInjuryIllnessEntryForm();
    }
  }
}
