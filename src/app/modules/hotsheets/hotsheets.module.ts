import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotsheetsRoutingModule } from './hotsheets-routing.module';
import { HotsheetsComponent } from './hotsheets.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SharedModule } from '../../shared/shared.module';
import { HotsheetAttributeEntryComponent } from './hotsheet-attribute-entry/hotsheet-attribute-entry.component';
import { DataTableMaintenanceModule } from "../data-table-maintenance/data-table-maintenance.module";

@NgModule({
  declarations: [
    HotsheetsComponent,
    HotsheetAttributeEntryComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    DropDownsModule,
    SharedModule,
    HotsheetsRoutingModule,
    DataTableMaintenanceModule
  ],
  exports: [HotsheetsComponent]
})
export class HotsheetsModule { }
