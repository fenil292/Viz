import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApsIssueComponent } from './aps-issue/aps-issue.component';
import { CreateProcessFlowComponent } from './process-flow/create-process-flow/create-process-flow.component';
import { ProcessFlowComponent } from './process-flow/process-flow.component';
import { ApsSettingsComponent } from './aps-settings/aps-settings.component';
import { PrioritiesComponent } from './priorities/priorities.component';

const routes: Routes = [
    { path: '', redirectTo: '/aps/priorities', pathMatch: 'full' },
    { path: 'priorities', component: PrioritiesComponent},
    { path: 'process-flow', component: ProcessFlowComponent},
    { path: 'create-process-flow', component: CreateProcessFlowComponent},
    { path: 'edit-process-flow', component: CreateProcessFlowComponent},
    { path: 'issues', component: ApsIssueComponent},
    { path: 'settings', component: ApsSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApsRoutingModule { }
