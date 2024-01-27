import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { TableWidgetDetailsComponent } from "./widgets/table-widget-details/table-widget-details.component";

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'widget-details', component: TableWidgetDetailsComponent },
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }