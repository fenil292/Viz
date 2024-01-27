import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrixuiConfigurationComponent } from './matrixui-configuration/matrixui-configuration.component';
import { VizerDisplayGroupsComponent } from './vizer-display-groups/vizer-display-groups.component';

const routes: Routes = [
  { path: '', redirectTo: '/vizer-integration/matrixui-configuration', pathMatch: 'full' },
  { path: 'matrixui-configuration', component: MatrixuiConfigurationComponent},
  { path: 'vizer-display-groups', component: VizerDisplayGroupsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VizerIntegrationRoutingModule { }
