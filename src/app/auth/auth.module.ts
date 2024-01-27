import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { SignInComponent } from './components/authorize/sign-in/sign-in.component';
import { SignUpComponent } from './components/authorize/sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForgotPasswordComponent } from './components/authorize/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/authorize/reset-password/reset-password.component';

@NgModule({
  declarations: [AuthorizeComponent, SignInComponent, SignUpComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [CommonModule, SharedModule, MatIconModule, MatAutocompleteModule, MatProgressSpinnerModule]
})
export class AuthModule {}
