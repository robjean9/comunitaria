import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  formForgotPassword: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formForgotPassword = this.fb.group({
      email: ['', Validators.email]
    });

  }

  async onSubmitFp() {
    if (this.formForgotPassword.valid) {

      const email = this.formForgotPassword.get('email').value;

      this.userService.fp(email)
        .subscribe(data => {
          this._snackBar.open('Você receberá um e-mail com a senha, se existir uma conta', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
          this.goToLogin();
        })
    }


  }

  goToLogin() {
    this.router.navigate(['/login']);

  }

}
