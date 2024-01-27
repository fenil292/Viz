import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApsRoutingModule } from './aps-routing.module';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '../../shared/shared.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ProcessFlowComponent } from './process-flow/process-flow.component';
import { CreateProcessFlowComponent } from './process-flow/create-process-flow/create-process-flow.component';
import { CreateFlowRuleComponent } from './process-flow/create-flow-rule/create-flow-rule.component';
import { ApsIssueComponent } from './aps-issue/aps-issue.component';
import { ApsSettingsComponent } from './aps-settings/aps-settings.component';
import { ApsIssueDetailsComponent } from './aps-issue/aps-issue-details/aps-issue-details.component';
import { ApsLogsComponent } from './aps-settings/aps-logs/aps-logs.component';
import { PrioritiesComponent } from './priorities/priorities.component';
import { CreatePriorityComponent } from './priorities/create-priority/create-priority.component';
import { ProcesFlowTroubleshootComponent } from './process-flow/proces-flow-troubleshoot/proces-flow-troubleshoot.component';

@NgModule({
  declarations: [
    ProcessFlowComponent,
    CreateProcessFlowComponent,
    CreateFlowRuleComponent,
    ApsIssueComponent,
    ApsSettingsComponent,
    ApsIssueDetailsComponent,
    ApsLogsComponent,
    PrioritiesComponent,
    CreatePriorityComponent,
    ProcesFlowTroubleshootComponent
  ],
  imports: [
    CommonModule,
    ApsRoutingModule,
    SharedModule
  ]
})
export class ApsModule { }
