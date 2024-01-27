import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AuthModule as ClientAuthModule } from './auth/auth.module';
import { JwtInterceptor } from './helpers/jwt.interceptors';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { HomeModule } from './modules/home.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { HotsheetsModule } from './modules/hotsheets/hotsheets.module';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ApsModule } from './modules/aps/aps.module';
import { AdminModule } from './modules/admin/admin.module';
import { LocalTimeFormatPipe } from './shared/helpers/local-time-format.pipe';
import { AuthModule, LogLevel, LoginResponse } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services/auth.service';
import { IUser } from './auth/models/auth.model';
import { tap } from 'rxjs';

const authConfig = environment.AUTH_CONFIG;
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    ClientAuthModule,
    AuthModule.forRoot({
      config: {
        authority: authConfig.authority,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: authConfig.clientId,
        responseType: 'code',
        customParamsCodeRequest: {
          client_secret: authConfig.client_secret
        },
        customParamsRefreshTokenRequest: {
          client_secret: authConfig.client_secret
        },
        scope: 'openid profile email roles viztoc_api offline_access',
        logLevel: LogLevel.None,
        startCheckSession: true,
        silentRenew: true,
        useRefreshToken: true,
        ignoreNonceAfterRefresh: true,
        triggerAuthorizationResultEvent: true,
        renewTimeBeforeTokenExpiresInSeconds: 30
      }
    }),
    HomeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    MatSidenavModule,
    DropDownsModule,
    ButtonModule,
    HotsheetsModule,
    DialogsModule,
    ApsModule,
    AdminModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe,
    LocalTimeFormatPipe,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

function initializeAuth(authService: AuthService) {
  return (): Promise<any> => {
    return authService.checkAuth().pipe(
      tap(((res: LoginResponse) => {
        if(!res.isAuthenticated) {
          authService.doLogin();
        } else {
          const token = authService.getAccessToken();
          const userData: IUser = {
            ...res.userData,
            token: token
          }
          authService.setUserData(userData);
        }
      }
    ))).toPromise();
  }
}
