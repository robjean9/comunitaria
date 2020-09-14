import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OcurrenceService } from '../services/ocurrence.service';

@Component({
  selector: 'app-create-ocurrence',
  templateUrl: './create-ocurrence.component.html',
  styleUrls: ['./create-ocurrence.component.scss']
})
export class CreateOcurrenceComponent implements OnInit {

  public latitude = 123123.123;
  public longitude = 123123.123;

  formOcurrence: FormGroup;
  constructor(private fb: FormBuilder, private ocurrenceService: OcurrenceService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

    this.formOcurrence = this.fb.group({
      description:['',Validators.required],
      zipCode:['',Validators.required],
      city:['',Validators.required],
      neighborhood:['',Validators.required],
      street:['',Validators.required],
      number:['',Validators.required],
      complement: [''],
      latitude:['',Validators.required],
      longitude:['',Validators.required],
      type:['assalto',Validators.required],
      anonymous:[false,Validators.required],
      ocurredAt:[false,Validators.required],
    })

    navigator.geolocation.getCurrentPosition(resp => {
      console.log(resp);
      this.latitude = resp.coords.longitude;
      this.longitude = resp.coords.latitude;
      this.formOcurrence.patchValue({latitude: this.latitude, longitude:this.longitude})
    },
      err => {
        console.log(err);
      });
  }


  async onSubmitOcurrence() {
    if (this.formOcurrence.valid) {
      let data = {
        description: this.formOcurrence.get('description').value,
        zip_code: this.formOcurrence.get('zipCode').value,
        city: this.formOcurrence.get('city').value,
        neighborhood: this.formOcurrence.get('neighborhood').value,
        street: this.formOcurrence.get('street').value,
        number: this.formOcurrence.get('number').value,
        complement: this.formOcurrence.get('complement').value,
        type: this.formOcurrence.get('type').value,
        anonymous: this.formOcurrence.get('anonymous').value,
        ocurred_at: this.formOcurrence.get('ocurredAt').value.getTime() ,
        latitude: this.latitude,
        longitude: this.longitude
      }

      console.log(data);

      this.ocurrenceService.create(data)
        .subscribe(data => {
          this._snackBar.open('Ocorrência criada', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
          this.router.navigate(['ocurrences'])
        },
          error => {
            this._snackBar.open('Erro ao criar ocorrência', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
          })

    }
  }


}
