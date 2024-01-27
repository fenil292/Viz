import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ConfirmDialogService } from '../../../../shared/helpers/confirm-dialog.service';
import { Condition, EmulateFlowRule, PriorityRule, ProcessFlow } from './../models/processflow.model';
import { ProcessflowService } from './../service/processflow.service';
import { CreateFlowRuleComponent } from '../create-flow-rule/create-flow-rule.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Data, Log } from '../../../../shared/models/shared.model';
import { QueryBuilderUtilityService } from '../../../../shared/helpers/query-builder-utility.service';
import { ProcesFlowTroubleshootComponent } from '../proces-flow-troubleshoot/proces-flow-troubleshoot.component';

@Component({
  selector: 'app-create-process-flow',
  templateUrl: './create-process-flow.component.html',
  styleUrls: ['./create-process-flow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProcessFlowComponent implements OnInit {
  path: string[] = ["aps", "process flow", "process flow entry"];
  index: string = "2.2.1";
  processFlowForm!: FormGroup;
  processFlowId: number = 0;
  processFlow!: ProcessFlow;
  isConditionsTab: boolean = true;
  isLoading: boolean = false;
  isValidConditions: boolean = false;
  conditions: Condition = undefined;
  queryConditions: Condition | undefined = undefined;
  flowRules: PriorityRule[] = [];
  isFlowRulesChange: boolean = false;
  notExistAttributes: any;
  flowRulesWithNotExistAttribute: number[] = [];
  processFlows: ProcessFlow[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private processFlowService: ProcessflowService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private queryBuilderUtilityService: QueryBuilderUtilityService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['id']) {
        this.processFlowId = parseInt(params['id']);
        if(this.processFlowId > 0) {
          this.getProcessFlowById();
        }
      } else {
        this.prepareProcessFlowForm();
      }
    });
    this.getProcessFlows();
  }

  onCancel() {
    this.router.navigate(['/aps/process-flow']);
  }

  onProcessTypeChange(value: boolean) {
    this.isConditionsTab = value;
  }

  onChangeCondition(conditions: any) {
    setTimeout(() => {
      if(conditions) {
        this.conditions = conditions.data;
        this.isValidConditions = conditions.errors;
        this.notExistAttributes = this.queryBuilderUtilityService.validateQueryForNotExistAttribue(this.conditions);
      }  
    }, 0); 
  }

  onAddFlowRule() {
    this.openFlowRuleDialog();
  }

  onUpdateFlowRule(index: number) {
    this.openFlowRuleDialog(index);
  }

  onDeleteFlowRule(index: number) {
    this.confirmDialogService.openConfirmDialog("Confirmation","Are you sure you want to delete this Priority Flow Rule?")
    .subscribe((response: any)=>{
      if(response.status) {
        this.deleteFlowRule(index);
      }
    });
  }

  onSubmit() {
    this.processFlowForm.markAllAsTouched();
    const isDefault = this.processFlowForm.get('default')?.value;
    if(!this.processFlowForm.invalid && ((this.conditions && this.isValidConditions && this.notExistAttributes.status) || isDefault)) {
      let data = this.processFlowForm.getRawValue();
      data.apsPriorityRule = this.flowRules;
      data.conditions = this.conditions;
      const duplicateProcessFlowName = this.processFlows.find((processFlow: ProcessFlow) => processFlow.name === data.name && processFlow.id !== data.id);
      const priorityCodes = [...new Set(this.flowRules.map(v => v.priorityCode))];
      const duplicatePriorities = priorityCodes.filter((priorityCode: string) => this.flowRules.filter((item: PriorityRule) => item.priorityCode === priorityCode).length > 1);
      if (duplicatePriorities.length > 0) {
        this.notificationService.error(`Aps Process Flow can't have 2 or more Aps Priority Rules with the same priority.<br>The next Priority Rules have duplicate values: '${duplicatePriorities}'`);
      }
      else if(duplicateProcessFlowName) {
        this.notificationService.error('Aps Process Flow name should be unique');
      }
      else {
        this.saveProcessFlow(data);
      }
    }
    else {
      if(this.notExistAttributes.status === false) {
        this.notificationService.error(this.notExistAttributes.message);
      }
    }
  }

  openTroubleshootRule(priorityRule: PriorityRule){
    this.isLoading = true;
    this.processFlowService.getTroubleshootRuleLogs(priorityRule.id).subscribe({
      next: (response: Data<EmulateFlowRule>) => {
        const troubleshootRuleLogs = response;
        this.openTroubleshootRuleDialog(troubleshootRuleLogs.data, priorityRule.priorityCode, troubleshootRuleLogs.logs as Log[]);
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareProcessFlowForm() {
    this.processFlowForm = this.formBuilder.group({
      id: [{value: (this.processFlow) ? this.processFlow.id : this.processFlowId, disabled: true}],
      name: [{ value: (this.processFlow) ? this.processFlow.name : '', disabled: (this.processFlow?.default) ?? false }, [Validators.required, Validators.maxLength(64)]],
      description: [{ value: (this.processFlow) ? this.processFlow.description : '', disabled: (this.processFlow?.default) ?? false }, Validators.maxLength(100)],
      enabled: [{ value: (this.processFlow) ? this.processFlow.enabled : false, disabled: (this.processFlow?.default) ?? false }],
      break: [{ value: (this.processFlow) ? this.processFlow.break : false, disabled: (this.processFlow?.default) ?? false }],
      sequence: [{value: (this.processFlow) ? this.processFlow.sequence : 0, disabled: true }],
      default: [{value: (this.processFlow?.default) ?? false, disabled: true}]
    });
  }

  private getProcessFlowById() {
      this.isLoading = true;
      this.processFlowService.getApsProcessFlowById(this.processFlowId).subscribe({
        next: (res: Data<ProcessFlow>) => {
          if(res.data) {
            this.processFlow = res.data;
            this.flowRules = this.processFlow.apsPriorityRule;
            this.queryConditions = this.processFlow.conditions;
            this.prepareProcessFlowForm();
            this.validateFlowRules(this.flowRules);
          }
        },
        error: (err: any) => {
          this.prepareProcessFlowForm();
          this.notificationService.error(err);
        }
      }).add(() => { this.isLoading = false; });
  }

  private saveProcessFlow(processFlow: ProcessFlow) {
    this.isLoading = true;
    this.processFlowService.saveApsProcessFlow(processFlow).subscribe({
      next: (res: Data<any>) => {
        this.onCancel();
        this.notificationService.success("Process flow has been saved successfully.");
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private getProcessFlows() {
    this.isLoading = true;
    this.processFlowService.getApsProcessFlowList().subscribe({
      next: (res: Data<ProcessFlow[]>) => {
        this.processFlows = res.data;
      }
    }).add(() => this.isLoading = false);
  }

  private openFlowRuleDialog(index: number | null = null) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: CreateFlowRuleComponent,
      width: (this.processFlow?.default ? '592px' : '970px'),
      height: (this.processFlow?.default ? '245px' : '630px'),
      cssClass: 'flow-rule-dialog'
    });

    if(index > -1) {
      const data = dialogRef.content.instance as CreateFlowRuleComponent;
      data.index = index;
      data.flowRule = this.flowRules[index];
      data.processFlowName = this.processFlowForm.get('name')?.value;
      data.isDefault = this.processFlowForm.get('default')?.value;
      data.flowRules = this.flowRules;
    }
    
    dialogRef.result.subscribe((result: any) => {
      if(result?.status && result?.data) {
        if(result?.index > -1 && result?.index !== null) {
          this.updateFlowRule(result.data, result.index);
        } else {
          this.addFlowRule(result.data);
        }
      }
    });
  }
  
  private openTroubleshootRuleDialog(emulateFlowRule: EmulateFlowRule, priorityCode: string, logs: Log[]) {
    const dialogRef: DialogRef = this.dialogService.open({
      content: ProcesFlowTroubleshootComponent,
      actions: [],
      height: '65%',
      width: '60%',
      actionsLayout: 'normal',
      cssClass: 'troubleshoot-rule-dialog'
    });

    const data = dialogRef.content.instance as ProcesFlowTroubleshootComponent;
    data.emulateFlowRule = emulateFlowRule;
    data.priorityCode = priorityCode;
    data.emalutedFlowRuleLogs= logs;
  }

  private addFlowRule(flowRule: PriorityRule) {
    this.flowRules.push(flowRule);
    this.isFlowRulesChange = true;
  }

  private updateFlowRule(flowRule: PriorityRule, index: number) {
    this.flowRules[index] = flowRule;
    this.isFlowRulesChange = true;
    this.validateFlowRules(this.flowRules);
  }

  private deleteFlowRule(index: number) {
    this.flowRules.splice(index, 1);
    this.isFlowRulesChange = true;
    this.validateFlowRules(this.flowRules);
  }

  private validateFlowRules(flowRules: PriorityRule[]) {
    if(!this.processFlow.default) {
      this.flowRulesWithNotExistAttribute = [];
      flowRules?.forEach((flowRule: PriorityRule) => {
        const notExistAttributes = this.queryBuilderUtilityService.validateQueryForNotExistAttribue(flowRule.conditions);
        if(!notExistAttributes.status) {
          this.flowRulesWithNotExistAttribute.push(flowRule.id);
        }
      });
    }
  }
}
