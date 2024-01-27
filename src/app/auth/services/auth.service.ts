import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../../endpoints/endpoints';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IUser } from '../models/auth.model';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_URL = endpoints.AUTH;

  private userSubject: BehaviorSubject<IUser>;
  user: Observable<IUser>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService) {
    this.userSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')));
  }

  public get loggedInUserValue(): IUser {
    return this.userSubject.value;
  }

  login(login, password): Observable<IUser> {
    return this.http.post<IUser>(`${this.AUTH_URL}/login`, { login, password }).pipe(
      map((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  setUserData(value: IUser) {
    this.userSubject.next(value);
  }

  get isLoggedIn() {
    return this.oidcSecurityService.isAuthenticated$;
  }

  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }

  checkAuth() {
    return this.oidcSecurityService.checkAuth();
  }

  doLogin() {
    return of(this.oidcSecurityService.authorize());
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }
}
