import { Injectable } from '@angular/core';
import {
  UrlTree,
  Router,
  CanActivate
} from '@angular/router';
import {AuthService} from '../services/core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {}

  /**
   *
   */
  public canActivate(): boolean|UrlTree {
    if(!this.authService.isAuth()) {
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
