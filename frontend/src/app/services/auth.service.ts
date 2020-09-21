import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoreService } from './store.service';

import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  public role;

  constructor(private router: Router, private http: HttpClient, private store: StoreService, private jwtHelper: JwtHelperService) {

  }




  login(email: string, password: string) {
    return this.http.post(this.store.server + 'login', { email, password })
      .pipe(
        map((response: Response) => {
          let data;
          data = response;
          if (data && data.token) {
            localStorage.setItem('access_token', data.token);
            this.isAuthenticated.next(true);
            this.loadRole();
            return true;
          }
          return false;
        })
      )
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('server_uri');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  async checkAuthenticated() {
    let token = localStorage.getItem('access_token');
    if (token !=null) {
      let tokenPayload = this.jwtHelper.decodeToken(token);
      console.log(tokenPayload);
      console.log(token);
      this.isAuthenticated.next(true);
      this.loadRole();
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  async loadRole(){
    let token = localStorage.getItem('access_token');
    if(token != null){
      let tokenPayload =  this.jwtHelper.decodeToken(token);
      let role = tokenPayload.role;
      this.role = role;
    }
  }





}