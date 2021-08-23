import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class StoreService{
  public server: string = 'https://backend-solidaria.herokuapp.com/';

  constructor(private router: Router, private http: HttpClient){
    if(localStorage.getItem('server_uri')){
      this.setServer(localStorage.getItem('server_uri'));
    }
  }


  public setServer(value){
    this.server = value;
    localStorage.setItem('server_uri', value);
  }

  




  

}