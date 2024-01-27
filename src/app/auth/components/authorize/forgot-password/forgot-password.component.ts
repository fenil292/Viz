import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  isEmailSend: boolean = false;
  version: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.version = environment.VERSION;
  }

  onSubmit() {
    this.forgotPasswordForm.markAllAsTouched();
    if(!this.forgotPasswordForm.invalid) {
      this.isEmailSend = true;
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  onResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
