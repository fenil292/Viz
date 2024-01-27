import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { AttributeModel } from '../models/custom-attribute.model';

@Component({
  selector: 'app-create-custom-attribute',
  templateUrl: './create-custom-attribute.component.html',
  styleUrls: ['./create-custom-attribute.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateCustomAttributeComponent implements OnInit {
  entity: string = '';
  dataTypes: string[] = [];
  attribute: AttributeModel | null = null;
  attributeForm!: FormGroup;
  existAttributeNames: string[] = [];
  tableFieldNames: string[] = [];
  removeHotSheetForTables: string[] = ['Work Order Operation'];

  constructor(
    private dialog: DialogRef,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.prepareAttributeForm();
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  onSubmit() {
    this.attributeForm.markAllAsTouched();
    if(this.attributeForm.valid) {
      const data = this.attributeForm.getRawValue() as AttributeModel;
      this.dialog.close({ status: true, data: data });
    }
  }

  private prepareAttributeForm() {
    this.attributeForm = this.formBuilder.group({
      id: [{value: (this.attribute) ? this.attribute.id : 0, disabled: true}],
      name: [(this.attribute) ? this.attribute.name : '', [Validators.required, this.ValidateName.bind(this), Validators.pattern(/^[a-zA-z]+[^ \-]*$/), Validators.maxLength(255)]],
      datatype: [(this.attribute) ? this.attribute.datatype : null, Validators.required],
      aps: [(this.attribute) ? this.attribute.aps : false],
      hotSheet: [(this.attribute) ? this.attribute.hotSheet : false],
      matrixUI: [(this.attribute) ? this.attribute.matrixUI : false]
    });

    if(this.removeHotSheetForTables.includes(this.entity)) {
      this.attributeForm.removeControl('hotSheet');
    }
  }

  private ValidateName(control: AbstractControl) {
    const isExistAttribute = this.existAttributeNames.includes(control.value.toLowerCase()) && this.attribute?.name?.toLowerCase() !== control.value.toLowerCase();
    if(isExistAttribute) {
      return { existAttribute: isExistAttribute };
    }
    else {
      const isExistField = this.tableFieldNames.includes(control.value.toLowerCase());
      if(isExistField) {
        return { existTableField: isExistField };
      }
    }
    return null;
  }
}
