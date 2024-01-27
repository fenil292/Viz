import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { HotsheetsApiService } from '../services/hotsheets-api.service';
import { Data } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { AttributeModel } from '../../admin/custom-attributes/models/custom-attribute.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-hotsheet-attribute-entry',
  templateUrl: './hotsheet-attribute-entry.component.html',
  styleUrls: ['./hotsheet-attribute-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HotsheetAttributeEntryComponent implements OnInit, AfterContentChecked {
  hotSheetId: number;
  attributeValue: string | null = null;
  attributes: any[] = [];
  attribute: AttributeModel;
  intialAttributes: any[] = [];
  isSubmit: boolean = false;
  isLoading: boolean = false;

  constructor(
    private dialog: DialogRef,
    private cdref: ChangeDetectorRef,
    private utilityService: UtilityService,
    private hotSheetService: HotsheetsApiService,
    private notificationService: NotificationService) { }

 ngOnInit(): void {
    this.attributes.push({
      name: this.attribute.name,
      datatype: this.attribute.datatype,
      customAttributeId: this.attribute.id,
      value: this.attributeValue
    });
    this.intialAttributes = cloneDeep(this.attributes);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  private saveHotSheetAttribute(attribute: any) {
    this.isLoading = true;
    const hotSheetAttribute: any = {
      hotSheetId: this.hotSheetId,
      customAttributeId: attribute.customAttributeId,
      value: attribute.value
    };
    this.hotSheetService.saveCustomAttributeValue(hotSheetAttribute).subscribe({
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

  onAttrributeValueChange(attributes: any[]) {
    attributes = attributes.sort((a: any, b: any) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialAttributes, attributes);
    if(!isEqual && this.isSubmit && attributes.length > 0) {
      this.attributes = attributes;
      this.saveHotSheetAttribute(this.attributes[0]);
    } else {
      setTimeout(() => {
        this.isSubmit = false;
      }, 0);
    }
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  onSubmit() {
    this.isSubmit = true;
  }
}