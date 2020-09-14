import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})

export class OcurrenceService {

  constructor(private router: Router, private http: HttpClient, private store: StoreService) {

  }



  create(data) {
    return this.http.post(this.store.server + 'ocurrences', data);
  }

  get(){
    return this.http.get<any>(this.store.server + 'ocurrences');
  }





}