import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableMaintenanceRoutingModule } from './data-table-maintenance-routing.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { WorkCentersComponent } from './work-centers/work-centers.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { WorkCentersEntryComponent } from './work-centers/work-centers-entry/work-centers-entry/work-centers-entry.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { WorkOrderOperationsComponent } from './work-order-operations/work-order-operations.component';
import { PartInfoComponent } from './part-info/part-info.component';
import { WorkOrderLogsComponent } from './work-order-logs/work-order-logs.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { SalesOrderDetailsComponent } from './sales-order-details/sales-order-details.component';
import { WorkOrderOperationAttributeEntryComponent } from './work-order-operations/work-order-operation-attribute-entry/work-order-operation-attribute-entry.component';
import { PartInfoAttributeEntryComponent } from './part-info/part-info-attribute-entry/part-info-attribute-entry.component';
import { WorkOrderAttributeEntryComponent } from './work-orders/work-order-attribute-entry/work-order-attribute-entry.component';

@NgModule({
  declarations: [
    WorkCentersComponent,
    WorkCentersEntryComponent,
    WorkCentersEntryComponent,
    WorkOrdersComponent,
    WorkOrderOperationsComponent,
    PartInfoComponent,
    WorkOrderLogsComponent,
    SalesOrdersComponent,
    SalesOrderDetailsComponent,
    WorkOrderOperationAttributeEntryComponent,
    PartInfoAttributeEntryComponent,
    WorkOrderAttributeEntryComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DropDownsModule,
    DateInputsModule,
    FormsModule,
    GridModule,
    DialogModule,
    InputsModule,
    DataTableMaintenanceRoutingModule,
    SharedModule
  ],
  exports: [
    WorkCentersComponent,
    WorkOrdersComponent,
    WorkOrderOperationsComponent,
    SalesOrderDetailsComponent
  ]
})
export class DataTableMaintenanceModule { }
