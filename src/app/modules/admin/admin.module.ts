import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetsComponent } from './integrations/datasets/datasets.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FailedIntegrationRequestsComponent } from './integrations/failed-integration-requests/failed-integration-requests.component';
import { DatasetDetailsComponent } from './integrations/datasets/dataset-details/dataset-details.component';
import { FailedIntegrationRequestsDetailsComponent } from './integrations/failed-integration-requests/failed-integration-requests-details/failed-integration-requests-details.component';
import { ExportComponent } from './export/export.component';
import { ExportLogsComponent } from './export/export-logs/export-logs.component';
import { ExportChangesetComponent } from './export/export-changeset/export-changeset.component';
import { CustomAttributesComponent } from './custom-attributes/custom-attributes.component';
import { CreateCustomAttributeComponent } from './custom-attributes/create-custom-attribute/create-custom-attribute.component';
import { WorkRelatedIllnessAndInjuriesComponent } from './work-related-illness-and-injuries/work-related-illness-and-injuries.component';
import { WorkRelatedInjuriesEntryComponent } from './work-related-illness-and-injuries/work-related-injuries-entry/work-related-injuries-entry.component';

@NgModule({
  declarations: [
    DatasetsComponent,
    FailedIntegrationRequestsComponent,
    DatasetDetailsComponent,
    FailedIntegrationRequestsDetailsComponent,
    ExportComponent,
    ExportLogsComponent,
    ExportChangesetComponent,
    CustomAttributesComponent,
    CreateCustomAttributeComponent,
    WorkRelatedIllnessAndInjuriesComponent,
    WorkRelatedInjuriesEntryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
