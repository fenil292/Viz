import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  resetPasswordForm = new FormGroup({
    email: new FormControl({ value: 'test@gmail.com', disabled: true }, Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });
  @ViewChild("passwordInput") passwordInput: TextBoxComponent;
  isPasswordVisible: boolean = false;
  @ViewChild("confirmPasswordInput") confirmPasswordInput: TextBoxComponent;
  isConfirmPasswordVisible: boolean = false;
  version: string = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.version = environment.VERSION;
  }

  ngAfterViewInit(): void {
    this.confirmPasswordInput.input.nativeElement.type = "password";
    this.passwordInput.input.nativeElement.type = "password";
  }

  onSubmit() {
    this.resetPasswordForm.markAllAsTouched();
    if(!this.resetPasswordForm.invalid) {
      const data = this.resetPasswordForm.getRawValue();
      if(data.newPassword === data.confirmPassword) {

      } else {
        this.notificationService.error('New password and confirm password should not matched.');
      }
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  showPassword(isNewPassword: boolean) {
    if (isNewPassword) {
      this.passwordInput.input.nativeElement.type = "text";
      this.isPasswordVisible = true;
    } else {
      this.confirmPasswordInput.input.nativeElement.type = "text";
      this.isConfirmPasswordVisible = true;
    }
  }

  hidePassword(isNewPassword: boolean) {
    if (isNewPassword) {
      this.passwordInput.input.nativeElement.type = "password";
      this.isPasswordVisible = false;
    } else {
      this.confirmPasswordInput.input.nativeElement.type = "password";
      this.isConfirmPasswordVisible = false;
    }
  }
}
