import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportComponent } from './export/export.component';
import { DatasetsComponent } from './integrations/datasets/datasets.component';
import { FailedIntegrationRequestsComponent } from './integrations/failed-integration-requests/failed-integration-requests.component';
import { CustomAttributesComponent } from './custom-attributes/custom-attributes.component';
import { WorkRelatedIllnessAndInjuriesComponent } from './work-related-illness-and-injuries/work-related-illness-and-injuries.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/integrations/failed-integration-requests', pathMatch: 'full'},
  { path: 'integrations', redirectTo: '/admin/integrations/failed-integration-requests', pathMatch: 'full'},
  {
    path: 'integrations/failed-integration-requests',
    component: FailedIntegrationRequestsComponent
  },
  {
    path: 'integrations/datasets',
    component: DatasetsComponent
  },
  {
    path: 'export',
    component: ExportComponent
  },
  {
    path: 'custom-attributes',
    component: CustomAttributesComponent
  },
  {
    path: 'work-related-illness-and-injuries',
    component: WorkRelatedIllnessAndInjuriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
