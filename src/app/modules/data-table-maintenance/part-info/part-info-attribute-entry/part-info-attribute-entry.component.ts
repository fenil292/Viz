import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Part, PartAttribute } from '../models/part-info.model';
import { PartInfoService } from '../services/part-info.service';
import { Data } from '../../../../shared/models/shared.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { UtilityService } from '../../../../shared/helpers/utility.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-part-info-attribute-entry',
  templateUrl: './part-info-attribute-entry.component.html',
  styleUrls: ['./part-info-attribute-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartInfoAttributeEntryComponent implements OnInit {
  partInfo: Part;
  attributes: PartAttribute[] = [];
  intialAttributes: PartAttribute[] = [];
  isLoading: boolean = false;
  isSubmit: boolean = false;

  constructor(
    private dialog: DialogRef,
    private utilityService: UtilityService,
    private partInfoService: PartInfoService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getPartAttributes();
  }

  onAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: PartAttribute, b: PartAttribute) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialAttributes, this.attributes);
    if(!isEqual && this.isSubmit) {
      this.attributes = attributes;
      this.saveCustomAttributes();
    } else {
      this.isSubmit = false;
    }
  }

  onSubmit() {
    this.isSubmit = true;
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  private getPartAttributes() {
    if(this.partInfo) {
      this.isLoading = true;
      this.partInfoService.getPartCustomAttributes(this.partInfo.id).subscribe({
        next: (res: Data<PartAttribute[]>) => {
          this.intialAttributes = cloneDeep(res.data).sort((a: PartAttribute, b: PartAttribute) => a.name > b.name ? 1 : -1);
          this.attributes = res.data;
        },
        error: (err: any) => {
          this.notificationService.error(err);
        }
      }).add(() => this.isLoading = false);
    }
  }

  private saveCustomAttributes() {
    this.isLoading = true;
    this.partInfoService.saveCustomAttributes(this.attributes).subscribe({
      next: (res: Data<any>) => {
        this.dialog.close({ status: true });
        this.notificationService.success('Custom Attribute has been successfully saved.');
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.isSubmit = false;
    });
  }
}