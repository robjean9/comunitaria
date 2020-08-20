import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.sass']
})
export class LoginComponentComponent implements OnInit {

  formLogin: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: ['', Validators.email],
      passowrd: ['', Validators.required]
    });

    //verify if authenticated and sent to home
  }

  async onSubmitLogin() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.formLogin.valid) {
      try {
        const email = this.formLogin.get('email').value;
        const password = this.formLogin.get('password').value;

      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
