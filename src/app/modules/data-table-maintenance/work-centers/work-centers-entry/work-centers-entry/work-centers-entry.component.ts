import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { VizerDisplayGroups } from '../../../../../modules/vizer-integration/vizer-display-groups/models/vizer-display-group.model';
import { VizerDisplayGroupsApiService } from '../../../../../modules/vizer-integration/vizer-display-groups/services/vizer-display-groups-api.service';
import { WorkCenterAttribute, WorkCenterModel } from '../../models/work-center.model';
import { WorkCentersApiService } from '../../services/work-centers-api.service';
import { forkJoin} from 'rxjs';
import { cloneDeep, isEqual } from 'lodash';

@Component({
  selector: 'app-work-centers-entry',
  templateUrl: './work-centers-entry.component.html',
  styleUrls: ['./work-centers-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkCentersEntryComponent extends DialogContentBase implements OnInit {
  id: any;
  isLoading = false;
  workCenterEntryModel: WorkCenterModel = new WorkCenterModel();
  workCenterEntryForm: FormGroup;
  vizerDisplayGroups: VizerDisplayGroups[] = [];
  workCenterAttributes: WorkCenterAttribute[] = [];
  multiSelectFilter: DropDownFilterSettings = { caseSensitive: false, operator: 'contains' };
  intialWorkCenter: WorkCenterModel = new WorkCenterModel();
  isSubmit: boolean = false;

  constructor(private apiWorkCentersService: WorkCentersApiService,
    private notificationService: NotificationService,
    private vizerDisplayGroupsService: VizerDisplayGroupsApiService,
    private formBuilder: FormBuilder,
    dialog: DialogRef) {
    super(dialog);
    this.createWorkCenterForm(this.workCenterEntryModel);
  }

  ngOnInit(): void {
    this.workCenterEntryModel.id = this.id;
    this.getEntryData();
  }

  getEntryData(): void {
    this.isLoading = true;
    forkJoin({
      workCenter: this.apiWorkCentersService.getWorkCenterDetails(this.id),
      vizerDisplayGroupsList: this.vizerDisplayGroupsService.getVizerDisplayGroups()
    }).subscribe(({workCenter,vizerDisplayGroupsList}) => {
      this.workCenterEntryModel = <WorkCenterModel>workCenter.data;
      this.vizerDisplayGroups.push(...vizerDisplayGroupsList.data?.sort((a, b) => a.name > b.name ? 1 : -1));
      this.workCenterAttributes = this.workCenterEntryModel?.attributes?.sort((a: WorkCenterAttribute, b: WorkCenterAttribute) => a.name > b.name ? 1 : -1);
      this.intialWorkCenter = cloneDeep(this.workCenterEntryModel);
      this.createWorkCenterForm(this.workCenterEntryModel);
      this.isLoading = false;
    }).add(() => this.isLoading = false);
  }

  onSaveWorkCenter(): any {
    if(this.workCenterAttributes?.length > 0) {
      this.isSubmit = true;
    }
    else {
      this.saveWorkCenter();
    }
  }

  cancel(): void {
    this.dialog.close();
  }

  onChangeColor(field: string) {
    if(!this.workCenterEntryForm.controls?.[field]?.value) {
      this.workCenterEntryForm.controls?.[field]?.setValue(null);
    }
  }

  onMultiSelectOpen(event: any) {
    const selectedVizerDisplayGroupsIds = this.workCenterEntryForm.controls.vizerDisplayGroupIds?.value;
    let selectedVizerDisplayGroups: any[] = [];
    if(selectedVizerDisplayGroupsIds?.length > 0) {
      selectedVizerDisplayGroupsIds.forEach((id: any) => {
        const index = this.vizerDisplayGroups.findIndex((x: VizerDisplayGroups) => x.id === id);
        if(index > -1) {
          selectedVizerDisplayGroups.push(...this.vizerDisplayGroups.splice(index, 1));
        }
      });
      this.vizerDisplayGroups = [...this.vizerDisplayGroups.sort((a, b) => a.name > b.name ? 1 : -1)];
      this.vizerDisplayGroups.unshift(...selectedVizerDisplayGroups);
      this.vizerDisplayGroups = [...this.vizerDisplayGroups];
    }
  }

  onAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: WorkCenterAttribute, b: WorkCenterAttribute) => a.name > b.name ? 1 : -1);
    let data = this.workCenterEntryForm.getRawValue() as WorkCenterModel;
    data.attributes = attributes;
    const _isEqual = isEqual(this.intialWorkCenter, data);
    if(!_isEqual && this.isSubmit) {
      this.workCenterAttributes = attributes;
      this.workCenterEntryForm.get('attributes')?.patchValue(this.workCenterAttributes);
      this.saveWorkCenter();
    } else {
      setTimeout(() => {
        this.isSubmit = false;        
      }, 0);
    }
  }

  private saveWorkCenter() {
    setTimeout(() => {
      this.isLoading = true;
    }, 0);
    let data = this.workCenterEntryForm.getRawValue() as WorkCenterModel;
    this.apiWorkCentersService.saveWorkCenter(data).subscribe({
      next: (response) => {
        this.notificationService.success('Work center has been saved successfully.');
        this.dialog.close({ success: true });
      },
      error: (error) => {
        this.notificationService.error(error);
        this.isLoading = false;
        this.isSubmit = false;
      }
    });
  }

  private createWorkCenterForm(workCenterEntry: WorkCenterModel): void {
    this.workCenterEntryForm = this.formBuilder.group({
      id: [(workCenterEntry ? this.id : '')],
      workCenterId: [{ value:  this.workCenterEntryModel.workCenterId, disabled: true }],
      alias: [(workCenterEntry ? workCenterEntry.alias : ''), [Validators.required, Validators.maxLength(50)]],
      vizerDisplayGroupIds: [(workCenterEntry ? workCenterEntry.vizerDisplayGroupIds === null || workCenterEntry.vizerDisplayGroupIds?.length === 0 ? [] : workCenterEntry.vizerDisplayGroupIds : [])],
      description: [(workCenterEntry ? workCenterEntry.description : ''), Validators.maxLength(10)],
      color: [(workCenterEntry ? workCenterEntry.color : '')],
      fontColor: [(workCenterEntry ? workCenterEntry.fontColor : '')],
      criticalConstraint: [(workCenterEntry) ? workCenterEntry.criticalConstraint : false],
      attributes: [{ value: (this.workCenterAttributes) ? this.workCenterAttributes : [], disabled: true}]
    })
  }
}

