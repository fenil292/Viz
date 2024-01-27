import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartInfoComponent } from './part-info/part-info.component';
import { WorkCentersComponent } from './work-centers/work-centers.component';
import { WorkOrderOperationsComponent } from './work-order-operations/work-order-operations.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { SalesOrderDetailsComponent } from './sales-order-details/sales-order-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/data-table-maintenance/work-centers', pathMatch: 'full' },
  { path: 'work-centers', component: WorkCentersComponent },
  { path: 'work-orders', component: WorkOrdersComponent},
  { path: 'work-order-details', component: WorkOrderOperationsComponent},
  { path: 'part-info', component: PartInfoComponent },
  { path: 'sales-orders', component: SalesOrdersComponent },
  { path: 'sales-order-details', component: SalesOrderDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTableMaintenanceRoutingModule { }
