import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './modules/home-component.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthorizeComponent } from './auth/components/authorize/authorize.component';

const moduleRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'hotsheets', loadChildren: () => import('./modules/hotsheets/hotsheets.module').then(m => m.HotsheetsModule) },
  { path: 'data-table-maintenance', loadChildren: () => import('./modules/data-table-maintenance/data-table-maintenance.module').then(m => m.DataTableMaintenanceModule) },
  { path: 'aps', loadChildren: () => import('./modules/aps/aps.module').then(m => m.ApsModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'vizer-integration', loadChildren: () => import('./modules/vizer-integration/vizer-integration.module').then(m => m.VizerIntegrationModule) }
];

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: moduleRoutes,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
