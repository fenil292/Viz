import { Component, OnInit, Input, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit, AfterViewInit {
  @Input() isLoading: boolean;
  @ViewChild("passwordInput") passwordInput: TextBoxComponent;
  isPasswordVisible: boolean = false;
  version: string = '';

  authFormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService) {}

  get login() {
    return this.authFormGroup.get('login');
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  ngOnInit(): void {
    this.hidePassword();
    if (this.authService.loggedInUserValue) {
      this.router.navigateByUrl('/');
    }

    // reset autocomplete
    setTimeout(() => {
      this.authFormGroup.controls.login.setValue('');
      this.authFormGroup.controls.password.setValue('');
    }, 1000);
    this.version = environment.VERSION;
  }

  ngAfterViewInit() {
    this.hidePassword();
  }

  handleLogin() {
    const login = this.authFormGroup.get('login').value;
    const password = this.authFormGroup.get('password').value;

    if (!login && password) return;
    this.isLoading = true;
    this.authService.login(login, password).subscribe(
      (user) => {
        this.isLoading = false;
        this.router.navigateByUrl('/');
      },
      (error) => {
        this.isLoading = false;
        this.notificationService.error(error);
      }
    );
  }

  showPassword() {
    if (this.passwordInput) {
      this.passwordInput.input.nativeElement.type = "text";
      this.isPasswordVisible = true;
    }
  }

  hidePassword() {
    if (this.passwordInput) {
      this.passwordInput.input.nativeElement.type = "password";
      this.isPasswordVisible = false;
    }
  }
}
