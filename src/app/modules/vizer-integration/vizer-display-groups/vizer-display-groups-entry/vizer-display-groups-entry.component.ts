import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NotificationService } from '../../../../shared/services/notification.service';
import { VizerDisplayGroups } from '../models/vizer-display-group.model';
import { VizerDisplayGroupsApiService } from '../services/vizer-display-groups-api.service';
import { WorkCentersApiService } from '../../../../modules/data-table-maintenance/work-centers/services/work-centers-api.service';
import { WorkCenterModel } from '../../../../modules/data-table-maintenance/work-centers/models/work-center.model';
import { BaseResponseModel } from '../../../../shared/models/base-response.model';

@Component({
  selector: 'app-vizer-display-groups-entry',
  templateUrl: './vizer-display-groups-entry.component.html',
  styleUrls: ['./vizer-display-groups-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VizerDisplayGroupsEntryComponent extends DialogContentBase implements OnInit {
  isLoading = false;
  entry: VizerDisplayGroups;
  id: any;
  vizerDisplayGroupForm: FormGroup;
  workCenters: WorkCenterModel[] = [];
  multiSelectFilter: DropDownFilterSettings = { caseSensitive: false, operator: 'contains', fields: ['alias', 'workCenterId'] };

  constructor(
    dialog: DialogRef,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private workCentersService: WorkCentersApiService,
    private vizerDisplayGroupsService: VizerDisplayGroupsApiService) {
      super(dialog);
      this.createVizerDisplayGroupForm();
  }

  ngOnInit(): void {
    this.getWorkCenters();
  }

  getVizerDisplayGroup(): void {
    this.isLoading = true;
    this.vizerDisplayGroupsService.getVizerDisplayGroupDetails(this.id).subscribe({
      next: (response) =>{
        if(response.data) {
          this.entry = response.data;
          this.createVizerDisplayGroupForm(this.entry);
        }
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  onSaveVizerDisplayGroup(): any {
    this.isLoading = true;
    const data = this.vizerDisplayGroupForm.getRawValue() as VizerDisplayGroups;
    this.vizerDisplayGroupsService.saveVizerDisplayGroup(data).subscribe({
      next: (response) => {
        this.notificationService.success('Vizer display group has been saved successfully.');
        this.dialog.close({ success: true });
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  onMultiSelectOpen(event: any) {
    const selectedWorkCentersIds = this.vizerDisplayGroupForm.controls.workCenterIds?.value;
    let selectedWorkCenters: any[] = [];
    if(selectedWorkCentersIds?.length > 0) {
      selectedWorkCentersIds.forEach((id: any) => {
        const index = this.workCenters.findIndex((x: WorkCenterModel) => x.id === id);
        if(index > -1) {
          selectedWorkCenters.push(...this.workCenters.splice(index, 1));
        }
      });
      this.workCenters = [...this.workCenters.sort((a, b) => a.alias > b.alias ? 1 : -1)];
      this.workCenters.unshift(...selectedWorkCenters);
      this.workCenters = [...this.workCenters];
    }
  }

  cancel(): void {
    this.dialog.close();
  }

  private createVizerDisplayGroupForm(vizerDisplayGroup: VizerDisplayGroups | undefined = undefined): void {
    this.vizerDisplayGroupForm = this.formBuilder.group({
      id: [{ value: (vizerDisplayGroup) ? vizerDisplayGroup.id : 0, disabled: true }],
      name: [(vizerDisplayGroup ? vizerDisplayGroup.name : ''), [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(50)]],
      description: [(vizerDisplayGroup ? vizerDisplayGroup.description : ''), Validators.maxLength(200)],
      workCenterIds: [(vizerDisplayGroup) ? vizerDisplayGroup.workCenterIds : []]
    });
  }

  private getWorkCenters() {
    this.isLoading = true;
    this.workCentersService.getWorkCenters().subscribe({
      next: (res: BaseResponseModel<WorkCenterModel[]>) => {
        this.workCenters = res.data.sort((a, b) => a.alias > b.alias ? 1 : -1);
      }
    }).add(() => {
      this.isLoading = false;
      if(this.id !== undefined) {
        this.getVizerDisplayGroup();
      }
    });
  }
}
