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
import { Data, LookUpItem } from '../../../../shared/models/shared.model';
import { MatrixuiConfigurationService } from '../../matrixui-configuration/services/matrixui-configuration.service';
import { MatrixUIConfiguration } from '../../matrixui-configuration/models/matriui-configuration.model';

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
  workCenters: LookUpItem[] = [];
  sortOrders: LookUpItem[] = [];
  selectedSortOrderDescription: string = null;
  multiSelectFilter: DropDownFilterSettings = { caseSensitive: false, operator: 'contains', fields: ['title', 'tag'] };

  constructor(
    dialog: DialogRef,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private workCentersService: WorkCentersApiService,
    private vizerDisplayGroupsService: VizerDisplayGroupsApiService,
    private matrixuiConfigurationService: MatrixuiConfigurationService) {
      super(dialog);
      this.createVizerDisplayGroupForm();
  }

  ngOnInit(): void {
    if(this.id) {
      this.getVizerDisplayGroup();
    } else {
      this.getWorkCenters();
    }
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
        const index = this.workCenters.findIndex((x: LookUpItem) => x.id === id);
        if(index > -1) {
          selectedWorkCenters.push(...this.workCenters.splice(index, 1));
        }
      });
      this.sortWorkCentersList();
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
      workCenterIds: [(vizerDisplayGroup) ? vizerDisplayGroup.workCenterIds : []],
      sortOrderId: [(vizerDisplayGroup) ? vizerDisplayGroup.sortOrderId : null, Validators.required]
    });
    this.vizerDisplayGroupForm.get('sortOrderId').valueChanges.subscribe((value) => {
      this.selectedSortOrderDescription = this.sortOrders.find((x: LookUpItem) => x.id === value)?.tag;
    });
    if(vizerDisplayGroup) {
      this.selectedSortOrderDescription = this.sortOrders.find((x: LookUpItem) => x.id === vizerDisplayGroup.sortOrderId)?.tag;
    }
  }

  private getVizerDisplayGroup(): void {
    this.isLoading = true;
    this.vizerDisplayGroupsService.getVizerDisplayGroupDetails(this.id).subscribe({
      next: (response) =>{
        if(response.data) {
          this.entry = response.data;
          this.workCenters = response.data.workCenters;
          this.sortOrders = response.data.sortOrders;
          this.createVizerDisplayGroupForm(this.entry);
        }
      },
      error: (error) => {
        this.notificationService.error(error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  private getWorkCenters(): void {
    this.isLoading = true;
    this.workCentersService.getWorkCenters().subscribe({
      next: (res: BaseResponseModel<WorkCenterModel[]>) => {
        this.workCenters = res.data?.map((workCenter: WorkCenterModel) => ({
          id: workCenter.id,
          title: workCenter.workCenterId,
          tag: workCenter.alias
        }));
        this.sortWorkCentersList();
      }
    }).add(() => {
      this.isLoading = false;
      this.getSortOrders();
    });
  }

  private getSortOrders(): void {
    this.isLoading = true;
    this.vizerDisplayGroupsService.getSortOrders().subscribe({
      next: (res: Data<LookUpItem[]>) => {
        this.sortOrders = res.data;
        this.getDefaultSortOrder();
      }
    }).add(() => this.isLoading = false);
  }

  private getDefaultSortOrder(): void {
    this.isLoading = true;
    this.matrixuiConfigurationService.getMatrixUIConfigurations().subscribe({
      next: (res: Data<MatrixUIConfiguration>) => {
        if(res.data.sortOrderId > 0) {
          this.vizerDisplayGroupForm.get('sortOrderId')?.patchValue(res.data.sortOrderId);
        }
      }
    }).add(() => this.isLoading = false);
  }

  private sortWorkCentersList(): void {
    this.workCenters = [...this.workCenters?.sort((a, b) => a.title > b.title ? 1 : -1)];
  }
}
