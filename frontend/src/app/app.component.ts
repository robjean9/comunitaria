import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  // @ViewChild('drawer',{static:false}) sidenav;
  opened = false

  constructor(private authService: AuthService){ 

    this.authService.isAuthenticated.subscribe(data=>{
      console.log(data);
      if(data){
        this.opened = true;
      }else{
        this.opened = false;
      }
    })
  }



  logout(){
    this.authService.logout();
  }

}
