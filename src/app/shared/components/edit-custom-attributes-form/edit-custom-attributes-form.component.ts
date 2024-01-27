import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataType } from '../query-builder/constants/query-builder.constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'app-edit-custom-attributes-form',
  templateUrl: './edit-custom-attributes-form.component.html',
  styleUrls: ['./edit-custom-attributes-form.component.scss']
})
export class EditCustomAttributesFormComponent implements OnInit, OnChanges {
  @Input() attributes: any[] = [];
  @Input() isSubmit: boolean = false;
  dataTypes = DataType;
  attributeForm: FormGroup;
  editAttribute: string | null = null;
  isAttributeHasValue: boolean = false;

  @Output() valueChange = new EventEmitter<any[]>();

  constructor(
    private formBuilder: FormBuilder,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.isAttributeHasValue = this.attributes.some((x: any) => x.value !== null);
    this.prepareAttributeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.attributes && changes.attributes?.currentValue) {
      this.attributes = changes.attributes.currentValue.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.prepareAttributeForm();
    }
    if(changes.isSubmit) {
      if(changes.isSubmit.currentValue) {
        this.updateAttributeValues(this.editAttribute);
      }
    }
  }

  onEditAttributeValue(attribute: any) {
    this.updateAttributeValues(this.editAttribute);
    if(attribute.datatype === this.dataTypes.BOOLEAN && attribute.value === null) {
      this.attributeForm.get(attribute.name)?.patchValue(false);
    } else {
      const value = this.utilityService.getValueByType(attribute.value, attribute.datatype);
      this.attributeForm.get(attribute.name)?.patchValue(value);
    }
    this.editAttribute = attribute.name;
  }

  onAcceptAttributeValue(attribute: any) {
    this.updateAttributeValues(attribute.name);
    this.editAttribute = null;
  }

  onClearAttributeValue(attribute: any) {
    this.attributeForm.get(attribute.name)?.patchValue(null);
    this.updateAttributeValues(attribute.name);
  }

  onCancelAttributeValue(attribute: any) {
    this.editAttribute = null;
  }

  showTooltip(e: MouseEvent, tooltipDir: any) {
    const element = e.target as HTMLElement;
    if(element?.offsetWidth < element?.scrollWidth && element?.closest('.attribute-value')) {
      tooltipDir.toggle(element);
    }
    else {
      if(element?.classList?.contains('data-value') !== true) {
        tooltipDir.hide();
      }
    }
  }

  private prepareAttributeForm() {
    let controls: any = {};
    this.attributes.forEach((attribute: any) => {
      const value = this.utilityService.getValueByType(attribute.value, attribute.datatype);
      controls[attribute.name] = new FormControl(value);
    });
    this.attributeForm = this.formBuilder.group(controls);
  }

  private updateAttributeValues(name: string) {
    const attributeValues = this.attributeForm.getRawValue();
    if(attributeValues) {
      const attribute = this.attributes.find((item: any) => item.name === name);
      if(attribute) {
        attribute.value = this.utilityService.convertValueTypeToString(attribute.datatype, attributeValues[attribute.name]);
      }
      this.isAttributeHasValue = this.attributes.some((x: any) => x.value !== null);
      this.valueChange.emit(this.attributes);
    }
  }
}
