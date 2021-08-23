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

  getMyOcurrences(){
    return this.http.get<any>(this.store.server + 'ocurrences/me');
  }

  getById(id:string){
    return this.http.get<any>(this.store.server + 'ocurrences/' + id);
  }

  update(data) {
    return this.http.put(this.store.server + 'ocurrences/' + data._id, data);
  }

  delete(id) {
    return this.http.delete(this.store.server + 'ocurrences/' + id);
  }

  vote(id, vote) {
    return this.http.patch(this.store.server + `ocurrences/${id}/vote`,{vote});
  }

  comment(id, text) {
    return this.http.patch(this.store.server + `ocurrences/${id}/comment`,{text});
  }
  deleteComment(id, comment_id) {
    return this.http.delete(this.store.server + `ocurrences/${id}/comment/${comment_id}`,);
  }




}