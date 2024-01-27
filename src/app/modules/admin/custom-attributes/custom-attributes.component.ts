import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { CustomAttributeService } from './services/custom-attribute.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Attribute, AttributeModel, CustomAttribute, PersistField } from './models/custom-attribute.model';
import { Data } from '../../../shared/models/shared.model';
import { CreateCustomAttributeComponent } from './create-custom-attribute/create-custom-attribute.component';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';

@Component({
  selector: 'app-custom-attributes',
  templateUrl: './custom-attributes.component.html',
  styleUrls: ['./custom-attributes.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CustomAttributesComponent implements OnInit {
  path: string[] = ["Admin", "Custom Attributes"];
  index: string = "5.3";
  avaliableDatatypes: string[] = [];
  tables: string[] = [];
  tableAttributes: Attribute[] = [];
  selectedAttribute: Attribute;
  isLoading: boolean = false;
  removeHotSheetForTables: string[] = ['Work Order Operation'];
  isCustomAttributesChange: boolean = false;

  constructor(
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private customAttributeService: CustomAttributeService) { }

  ngOnInit(): void {
    this.getCustomAttributes();
  }

  onSubmit() {
    this.saveCustomAttributes();
  }

  onCancel() {
    this.getCustomAttributes();
  }

  onChangeTable(value: any) {
    this.selectedAttribute = this.changeCustomAttribute(value);
  }

  onAddNewCustomAttribute() {
    this.openCustomAttributeDialog();
  }

  onEditAttribute(attribute: AttributeModel) {
    this.openCustomAttributeDialog(attribute);
  }

  onDeleteAttribute(attribute: AttributeModel) {
    if(attribute.id > 0) {
      this.getAttributeValues(attribute);
    } else {
      this.openAttributeDeleteConfirmDialog(attribute.name);
    }
  }

  private getCustomAttributes() {
    this.isLoading = true;
    this.customAttributeService.getCustomAttributes().subscribe({
      next: (res: Data<CustomAttribute>) => {
        this.avaliableDatatypes = res.data.avaliableDatatypes;
        this.tableAttributes = res.data.attributes;
        if(this.tableAttributes?.length > 0) {
          this.selectedAttribute = this.changeCustomAttribute(this.selectedAttribute?.name ?? this.tableAttributes[0].name);
          this.tables = this.tableAttributes.map((attribute: Attribute) => attribute.name);
        }
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private saveCustomAttributes() {
    const customAttributes: CustomAttribute = {
      avaliableDatatypes: this.avaliableDatatypes,
      attributes: this.tableAttributes
    }
    this.customAttributeService.saveCustomAttributes(customAttributes).subscribe({
      next: (res: Data<any>) => {
        this.isCustomAttributesChange = false;
        this.notificationService.success("Custom attributes has been saved successfully.");
        this.getCustomAttributes();
      },
      error: (err: any) => {
        this.notificationService.error(err);
        this.isLoading = false;
      }
    });
  }

  private getAttributeValues(attribute: AttributeModel) {
    if(attribute.id > 0) {
      this.isLoading = true;
      this.customAttributeService.getAttributeValues(attribute.id).subscribe({
        next: (res: Data<boolean>) => {
          this.openAttributeDeleteConfirmDialog(attribute.name, res.data);
        },
        error: (err: any) => {
          this.notificationService.error(err);
        }
      }).add(() => this.isLoading = false);
    }
  }

  private changeCustomAttribute(name: string) {
    return this.tableAttributes.find((attribute: Attribute) => attribute.name === name);
  }

  private deleteCustomAttribute(name: string) {
    const index = this.selectedAttribute.attributes.findIndex((attribute: AttributeModel) => attribute.name === name);
    if(index > -1) {
      this.selectedAttribute.attributes.splice(index, 1);
      this.isCustomAttributesChange= true;
    }
  }

  private openCustomAttributeDialog(attribute: AttributeModel | undefined = undefined) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: CreateCustomAttributeComponent,
      width: '550px',
      cssClass: 'custom-attribute-dialog'
    });

    const data = dialogRef.content.instance as CreateCustomAttributeComponent;
    data.dataTypes = this.avaliableDatatypes?.sort();
    data.entity = this.selectedAttribute.name;
    data.existAttributeNames = this.selectedAttribute.attributes.map((attribute: AttributeModel) => attribute.name);
    data.tableFieldNames = this.selectedAttribute.persistFields.map((field: PersistField) => field.column.toLowerCase());
    if(attribute) {
      data.attribute = attribute;
    }

    dialogRef.result.subscribe((result: any) => {
      if(result?.status && result?.data) {
        if(attribute) {
          const index = this.selectedAttribute.attributes.findIndex((item: AttributeModel) => item.name === attribute.name);
          if(index > -1) {
            this.selectedAttribute.attributes.splice(index, 1, result.data);
            this.isCustomAttributesChange = true;
          }
        } else {
          this.selectedAttribute.attributes.push(result.data);
          this.isCustomAttributesChange = true;
        }
      }
    });
  }

  private openAttributeDeleteConfirmDialog(attributeName: string, attributeValues: any = false) {
    let message = `Are you sure you want to delete the attribute '${attributeName}'?`;
    if(attributeValues) {
      message = `The attribute '${attributeName}' has values for some enitities. Are you sure you want to delete the attribute?`;
    }

    this.confirmDialogService.openConfirmDialog('Confirmation', message).subscribe((response: any) => {
      if(response.status) {
        this.deleteCustomAttribute(attributeName);
      }
    });
  }
}
