import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotsheetsComponent } from './hotsheets.component';

const routes: Routes = [{ path: '', component: HotsheetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotsheetsRoutingModule { }
