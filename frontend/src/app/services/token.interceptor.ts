import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    req = req.clone({ setHeaders: { Authorization: localStorage.getItem('access_token') || '' } });

    return next.handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            if (event.status == 200) {
              return;
            }
          }
        },
          error => {
            if (error.status == 401) {
              this.authService.logout();
            }
          })
      )
  }
}