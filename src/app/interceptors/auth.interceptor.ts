import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable, timeout} from 'rxjs';
import {AuthService} from '../services/core/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   *
   * @param request
   * @param next
   */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(AuthService.isAuth()) {
      return next.handle(request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + AuthService.getAuthToken().token)
      }));
    }
    return next.handle(request);
  }

}
