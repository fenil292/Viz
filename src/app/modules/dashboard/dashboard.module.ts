import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "../../shared/shared.module";
import { TableWidgetComponent } from "./widgets/table-widget/table-widget.component";
import { KeyvalueWidgetComponent } from "./widgets/keyvalue-widget/keyvalue-widget.component";
import { GroupWidgetComponent } from "./widgets/group-widget/group-widget.component";
import { CadenceWidgetComponent } from "./widgets/cadence-widget/cadence-widget.component";
import { TableWidgetDetailsComponent } from "./widgets/table-widget-details/table-widget-details.component";
import { LineGraphWidgetComponent } from './widgets/line-graph-widget/line-graph-widget.component';
import 'hammerjs';

@NgModule({
    declarations: [
      DashboardComponent,
      TableWidgetComponent,
      KeyvalueWidgetComponent,
      GroupWidgetComponent,
      CadenceWidgetComponent,
      TableWidgetDetailsComponent,
      LineGraphWidgetComponent
    ],
    imports: [
      CommonModule,
      DashboardRoutingModule,
      SharedModule,
      ChartsModule
    ]
})
export class DashboardModule { }