import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class AuthService{
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private httpClient: HttpClient){
    
  }

  

}