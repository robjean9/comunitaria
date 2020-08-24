import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private router: Router, private http: HttpClient, private store: StoreService) {

  }



  signup(data) {
    return this.http.post(this.store.server + 'user', data);
  }

  me() {
    return this.http.get<any>(this.store.server + 'me');
  }

  update(data) {
    return this.http.put<any>(this.store.server + 'user', data);
  }

  fp(data) {
    return this.http.get<any>(this.store.server + 'forgotPassword?email='+data);
  }






}