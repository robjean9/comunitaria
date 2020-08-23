import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  formSignup: FormGroup;

  private formSubmitAttempt: boolean;
  public errorIncomplete: boolean;
  public errorDuplicated: boolean;

  public latitude = 123123.123;
  public longitude = 123123.123;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private store: StoreService, private userService: UserService) { }

  ngOnInit(): void {
    this.formSignup = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      phone: ['', Validators.required],
    });


    navigator.geolocation.getCurrentPosition(resp => {
      console.log(resp);
      this.latitude =  resp.coords.longitude;
      this.longitude = resp.coords.latitude;
    },
    err => {
      console.log(err);
    });
  }

  async onSubmitSignup() {
    this.errorDuplicated = this.errorIncomplete = false;
    this.formSubmitAttempt = false;
    if (this.formSignup.valid) {
      try {

        let data = {
          name: this.formSignup.get('name').value,
          email: this.formSignup.get('email').value,
          password: this.formSignup.get('password').value,
          zip_code: this.formSignup.get('zipCode').value,
          city: this.formSignup.get('city').value,
          neighborhood: this.formSignup.get('neighborhood').value,
          street: this.formSignup.get('street').value,
          number: this.formSignup.get('number').value,
          complement: this.formSignup.get('complement').value,
          phone: this.formSignup.get('phone').value,
          latitude: this.latitude,
          longitude: this.longitude
        }


        this.userService.signup(data).subscribe(response => {
          this.router.navigate(['/login']);

        }, error => {
          if(error.status == 400){
            this.errorIncomplete = true;
          }else if (error.status == 409){
            this.errorDuplicated = true;
          }
        })

      } catch (err) {
        console.log(err);
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }





}
