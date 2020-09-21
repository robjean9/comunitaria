import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { MatDialog } from '@angular/material/dialog';
import { ServerDialogComponent } from '../server-dialog/server-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private store: StoreService, public dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.store.server == '' || this.store.server == undefined) {
      this.dialog.open(ServerDialogComponent);

      return;
    }

    if(req.url.includes('maps.googleapis.com')){
      return next.handle(req);
    }
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