import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { WorkOrderApiService } from '../services/work-order-api.service';
import { CustomAttributeService } from '../../../../modules/admin/custom-attributes/services/custom-attribute.service';
import { CustomAttrbuteEntities, Data } from '../../../../shared/models/shared.model';
import { AttributeModel } from '../../../../modules/admin/custom-attributes/models/custom-attribute.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { cloneDeep } from 'lodash';
import { UtilityService } from '../../../../shared/helpers/utility.service';

@Component({
  selector: 'app-work-order-attribute-entry',
  templateUrl: './work-order-attribute-entry.component.html',
  styleUrls: ['./work-order-attribute-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderAttributeEntryComponent implements OnInit {
  workOrderId: number;
  attributeName: string;
  attributeValue: string | null = null;
  attributes: any[] = [];
  intialAttributes: any[] = [];
  isLoading: boolean = false;
  isSubmit: boolean = false;

  constructor(
    private dialog: DialogRef,
    private utilityService: UtilityService,
    private workOrderService: WorkOrderApiService,
    private customAttributeService: CustomAttributeService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAttribute();
  }

  onAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: any, b: any) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialAttributes, attributes);
    if(!isEqual && this.isSubmit && attributes.length > 0) {
      this.attributes = attributes;
      this.saveWorkOrderAttribute(this.attributes[0]);
    } else {
      setTimeout(() => {
        this.isSubmit = false;
      }, 0);
    }
  }

  onSubmit() {
    this.isSubmit = true;
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  private getAttribute() {
    this.isLoading = true;
    this.customAttributeService.getCustomAttributeByName(CustomAttrbuteEntities.WorkOrder, this.attributeName).subscribe({
      next: (res: Data<AttributeModel>) => {
        if(res.data) {
          this.attributes.push({
            name: res.data.name,
            datatype: res.data.datatype,
            customAttributeId: res.data.id,
            value: this.attributeValue
          });
          this.intialAttributes = cloneDeep(this.attributes);
        }
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  private saveWorkOrderAttribute(attribute: any) {
    this.isLoading = true;
    const workOrderAttribute: any = {
      workOrderId: this.workOrderId,
      customAttributeId: attribute.customAttributeId,
      value: attribute.value
    };
    this.workOrderService.saveWorkOrderAttributeValue(workOrderAttribute).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success('Custom Attribute has been successfully saved.');
        this.dialog.close({ status: true, data: attribute.value });
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    }).add(() => {
      this.isLoading = false;
      this.isSubmit = false;
    });
  }
}
