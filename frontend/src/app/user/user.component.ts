import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  formUser: FormGroup;
  dataLoaded: boolean = false;

  userId: string;

  updateError: boolean;
  public latitude = 123123.123;
  public longitude = 123123.123;

  constructor(private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userService.me()
      .subscribe(data => {
        this.userId = data._id;
        this.formUser = this.fb.group({
          name: [data.name, Validators.required],
          email: [{ value: data.email, disabled: true }],
          password: [''],
          zipCode: [data.zip_code, Validators.required],
          city: [data.city, Validators.required],
          neighborhood: [data.neighborhood, Validators.required],
          street: [data.street, Validators.required],
          number: [data.number, Validators.required],
          complement: [data.complement, Validators.required],
          phone: [data.phone, Validators.required],
        });
        this.dataLoaded = true;
      });

    navigator.geolocation.getCurrentPosition(resp => {
      console.log(resp);
      this.latitude = resp.coords.longitude;
      this.longitude = resp.coords.latitude;
    },
      err => {
        console.log(err);
      });
  }

  async onSubmitSignup() {
    this.updateError = false;
    if (this.formUser.valid) {
      let data = {
        _id: this.userId,
        name: this.formUser.get('name').value,
        email: this.formUser.get('email').value,
        password: this.formUser.get('password').value,
        zip_code: this.formUser.get('zipCode').value,
        city: this.formUser.get('city').value,
        neighborhood: this.formUser.get('neighborhood').value,
        street: this.formUser.get('street').value,
        number: this.formUser.get('number').value,
        complement: this.formUser.get('complement').value,
        phone: this.formUser.get('phone').value,
        latitude: this.latitude,
        longitude: this.longitude
      }

      this.userService.update(data)
        .subscribe(data => {
          this._snackBar.open('Dados atualizados', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
        },
          error => {
            this.updateError = true;
          })

    }
  }

}
