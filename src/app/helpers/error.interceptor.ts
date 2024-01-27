import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.signOut();
          return throwError('Your session has expired. Please login the system.');
        }

        let error = "";
        if(err.status === 503 || err.status === 0) {
          error = "API is not available. Code Error: 503";
        } else {
          error = err?.error?.message || ((typeof err?.error === 'string') ? err?.error : err?.statusText);
        }
        
        return throwError(error);
      })
    );
  }
}
