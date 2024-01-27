import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = this.authenticationService.getAccessToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event?.body?.status?.toLowerCase() === 'error' || event?.body?.status?.toLowerCase() === 'validationerror')) {
          if(((event?.body?.logs && event?.body?.logs?.length > 0) || (event?.body?.data && event?.body?.data?.length > 0))
            && event?.body?.status?.toLowerCase() === 'error') {
              let err = event?.body?.message;
              if (!err) {
                err = event.body.logs[0].description;
              }
              console.error(`Error: ${err} for ${event.url}`);
              throw {
                logs: event.body.logs,
                data: event.body.data,
                message: new Error(err).message
              }
            }
            const err = new Error(event?.body?.message);
            console.error(`Error: ${err?.message} for ${event.url}`);
            throw err.message;
        }
        else{
          return event;
        }
      })
    );
  }
}
