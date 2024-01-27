import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Priority } from '../../priorities/models/priority.model';
import { PriorityService } from '../../priorities/services/priority.service';
import { Condition, Data, PriorityRule } from './../models/processflow.model';
import { QueryBuilderUtilityService } from '../../../../shared/helpers/query-builder-utility.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-create-flow-rule',
  templateUrl: './create-flow-rule.component.html',
  styleUrls: ['./create-flow-rule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateFlowRuleComponent implements OnInit {
  conditions: Condition | undefined = undefined;
  query: Condition;
  flowRule: PriorityRule;
  flowRuleForm!: FormGroup;
  priority: Priority[] = [];
  processFlowId: number = 0;
  flowRules: PriorityRule[] = [];
  index: number | null = null;
  isLoading: boolean = false;
  isValidConditions: boolean = false;
  processFlowName: string = "";
  isDefault: boolean = false;
  notExistAttributes: any;

  constructor(
    public dialog: DialogRef,
    private formBuilder: FormBuilder,
    private priorityService: PriorityService,
    private notificationService: NotificationService,
    private queryBuilderUtilityService: QueryBuilderUtilityService) { }

  ngOnInit(): void {
    this.getPriority();
    this.prepareFlowRuleForm();
    if(this.flowRule) {
      this.query = this.flowRule.conditions;
    }
  }

  onCancel() {
    this.dialog.close({ status: false });
  }

  onSubmit() {
    this.flowRuleForm.markAllAsTouched();
    if(this.isDefault) {
      this.conditions = { operator: 0, rules: [], groupRules: [] };
    }
    if(!this.flowRuleForm.invalid && ((this.conditions && this.isValidConditions && this.notExistAttributes.status) || this.isDefault)) {
      let data = this.flowRuleForm.getRawValue();
      data.conditions = this.conditions;
      data.priorityCode = this.priority.find(x => x.id === data.priorityInfoId)?.priorityCode ?? '';
      let duplicateFlowRules = this.flowRules.find((x: any, index: number) => x.priorityCode === data.priorityCode && index !== this.index);
      if (duplicateFlowRules) {
        this.notificationService.error(`Aps Process Flow can't have 2 or more Aps Priority Rules with the same '${data.priorityCode}' priority`);
      }
      else {
        this.dialog.close({ status: true, data: data, index: this.index });
      }
    }
    else {
      if(this.notExistAttributes.status === false) {
        this.notificationService.error(this.notExistAttributes.message);
      }
    }
  }

  onChangeCondition(conditions: any) {
    if(conditions) {
      this.conditions = conditions.data;
      this.isValidConditions = conditions.errors;
      this.notExistAttributes = this.queryBuilderUtilityService.validateQueryForNotExistAttribue(this.conditions);
    }
  }

  private prepareFlowRuleForm() {
    this.flowRuleForm = this.formBuilder.group({
      id: [{ value: (this.flowRule) ? this.flowRule.id : 0, disabled: true }],
      apsProcessFlowId: [{ value: (this.flowRule) ? this.flowRule.apsProcessFlowId : this.processFlowId, disabled: true }],
      priorityInfoId: [(this.flowRule) ? this.flowRule.priorityInfoId : null, Validators.required],
      description: [{ value: (this.flowRule) ? this.flowRule.description : '', disabled: this.isDefault }, Validators.maxLength(100)]
    });
  }

  private getPriority() {
    this.isLoading = true;
    this.priorityService.getPriorityInfos().subscribe({
      next: (res: Data<Priority[]>) => {
        if(res.data) {
          this.priority = res.data.sort((a, b) => a.sequence - b.sequence);
        }
      }
    }).add(() => this.isLoading = false);
  }
}
