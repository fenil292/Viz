import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './components/header/profile/profile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { ExcelModule, GridModule } from "@progress/kendo-angular-grid";
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { QueryBuilderModule } from 'angular2-query-builder';
import { PopupModule } from '@progress/kendo-angular-popup';
import { IconComponent } from './components/icon/icon.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LeftSideNavComponent } from './components/left-side-nav/left-side-nav.component';
import { QueryBuilderComponent } from './components/query-builder/query-builder.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViztocSpinnerComponent } from './components/viztoc-spinner/viztoc-spinner.component';
import { ToastrModule } from 'ngx-toastr';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropdownPanelComponent } from './components/dropdown-panel/dropdown-panel.component';
import { MulticheckFilterComponent } from './components/multicheck-filter/multicheck-filter.component';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';
import { EditCustomAttributesFormComponent } from './components/edit-custom-attributes-form/edit-custom-attributes-form.component';
import { LocalTimeFormatPipe } from './helpers/local-time-format.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    BreadcrumbComponent,
    IconComponent,
    LeftSideNavComponent,
    QueryBuilderComponent,
    ConfirmDialogComponent,
    ViztocSpinnerComponent,
    DropdownPanelComponent,
    MulticheckFilterComponent,
    DateRangeFilterComponent,
    EditCustomAttributesFormComponent,
    LocalTimeFormatPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatAutocompleteModule,
    GridModule,
    RouterModule,
    TooltipModule,
    ExcelModule,
    PopupModule,
    QueryBuilderModule,
    LayoutModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    DialogModule,
    DragDropModule,
    ToastrModule.forRoot(),
    ButtonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    ProfileComponent,
    HeaderComponent,
    BreadcrumbComponent,
    QueryBuilderModule,
    PopupModule,
    IconComponent,
    LayoutModule,
    LeftSideNavComponent,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    QueryBuilderComponent,
    DialogModule,
    GridModule,
    ConfirmDialogComponent,
    DragDropModule,
    ViztocSpinnerComponent,
    ToastrModule,
    ButtonModule,
    TooltipModule,
    DropdownPanelComponent,
    MulticheckFilterComponent,
    DateRangeFilterComponent,
    EditCustomAttributesFormComponent,
    LocalTimeFormatPipe
  ]
})
export class SharedModule {}
