import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkOrderOperationAttribute } from '../models/work-order-operation.model';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { UtilityService } from '../../../../shared/helpers/utility.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-work-order-operation-attribute-entry',
  templateUrl: './work-order-operation-attribute-entry.component.html',
  styleUrls: ['./work-order-operation-attribute-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderOperationAttributeEntryComponent implements OnInit {
  attributes: WorkOrderOperationAttribute[] = [];
  intialAttributes: WorkOrderOperationAttribute[] = [];
  isSubmit: boolean = false;

  constructor(
    private dialog: DialogRef,
    private utilityService: UtilityService,) { }

  ngOnInit(): void {
    this.intialAttributes = cloneDeep(this.attributes).sort((a: WorkOrderOperationAttribute, b: WorkOrderOperationAttribute) => a.name > b.name ? 1 : -1);
  }

  onAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: WorkOrderOperationAttribute, b: WorkOrderOperationAttribute) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialAttributes, attributes);
    if(!isEqual && this.isSubmit) {
      this.attributes = attributes;
      setTimeout(() => {
        this.dialog.close({ status: true, data: this.attributes });
      }, 0);
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
}