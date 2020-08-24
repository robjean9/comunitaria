import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {

  formLogin: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private auth: AuthService, private store: StoreService) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      server: [this.store.server, Validators.pattern('^https?:\/\/(.*)')],
      email: ['', Validators.email],
      password: ['', Validators.required]
    });

    //verify if authenticated and sent to home
  }

  async onSubmitLogin() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.formLogin.valid) {
      try {
        const server = this.formLogin.get('server').value;
        const email = this.formLogin.get('email').value;
        const password = this.formLogin.get('password').value;

        this.store.setServer(server);

        this.auth.login(email,password).subscribe(data=>{
          console.log(data);
          
          if(data){
            console.log('me');
            this.router.navigate(['me']);
          }else{

          }


        },erro=>{
          this.loginInvalid = true;
        })
        
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  goToSignup(){
    if(this.store.server!=""){
      this.router.navigate(['/signup']);
    }
  }

  goToFp(){
  
      this.router.navigate(['/fp']);
    
  }
}
