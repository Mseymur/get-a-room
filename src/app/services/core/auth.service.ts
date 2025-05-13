import { Injectable } from '@angular/core';
import {AuthToken} from "../../interfaces/core/auth-token";
import {Observable, tap} from 'rxjs';
import {HttpService} from "./http.service";
import {map} from "rxjs/operators";
import {StorageService} from "./storage.service";
import {AuthTokenFactory} from '../../factories/core/auth-token.factory';
import {User} from '../../interfaces/core/user';
import {UserFactory} from '../../factories/core/user.factory';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static _authToken: AuthToken = null;
  private static _user: User = null;

  /**
   *
   * @param httpService
   * @param router
   */
  constructor(private httpService: HttpService,
              private router: Router) {
    if(StorageService.getItem('authToken')) {
      AuthService._authToken = StorageService.getItem('authToken');
    }

    if(StorageService.getItem('user')) {
      AuthService._user = StorageService.getItem('user');
    }
  }

  /**
   *
   */
  public static getAuthToken(): AuthToken {
    return AuthService._authToken;
  }

  /**
   *
   */
  public static getUser(): User {
    return AuthService._user;
  }

  public static isAuth(): boolean {
    return AuthService._authToken !== null;
  }

  get authToken(): AuthToken {
    return AuthService._authToken;
  }

  get user(): User {
    return AuthService._user;
  }

  /**
   *
   */
  public logout(): void {
    this.removeAuthData();
    this.router.navigateByUrl('/login').finally();
  }

  /**
   *
   */
  public removeAuthData(): void {
    AuthService._authToken = null;
    AuthService._user = null;
    StorageService.removeItem('authToken');
    StorageService.removeItem('user');
  }

  /**
   *
   */
  public isAuth(): boolean {
    return AuthService._authToken !== null;
  }

  /**
   *
   * @param email
   * @param password
   */
  public auth(email: string, password: string): Observable<AuthToken> {
    return this.httpService.post<{ valid_to: any, password: any }>({
      url: ['auth'],
    }, {
      email: email,
      password: password
    }).pipe(map((_authToken) => {
      return AuthTokenFactory.fromObject(_authToken);
    }), tap((_authToken) => {
      StorageService.setItem('authToken', _authToken);
      AuthService._authToken = _authToken;
    }));
  }

  /**
   *
   */
  public loadUser(): Observable<User> {
    return this.httpService.get<User>({
      url: ['user'],
    }).pipe(map((_user) => {
      return UserFactory.fromObject(_user);
    }), tap((_user) => {
      StorageService.setItem('user', _user);
      AuthService._user = _user;
    }));
  }

}
