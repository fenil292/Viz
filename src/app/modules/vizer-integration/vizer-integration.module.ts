import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VizerIntegrationRoutingModule } from './vizer-integration-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatrixuiConfigurationComponent } from './matrixui-configuration/matrixui-configuration.component';
import { VizerDisplayGroupsComponent } from './vizer-display-groups/vizer-display-groups.component';
import { VizerDisplayGroupsEntryComponent } from './vizer-display-groups/vizer-display-groups-entry/vizer-display-groups-entry.component';

@NgModule({
  declarations: [
    MatrixuiConfigurationComponent,
    VizerDisplayGroupsComponent,
    VizerDisplayGroupsEntryComponent
  ],
  imports: [
    CommonModule,
    VizerIntegrationRoutingModule,
    SharedModule
  ]
})
export class VizerIntegrationModule { }
