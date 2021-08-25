import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OcurrenceService } from '../services/ocurrence.service';

@Component({
  selector: 'app-create-ocurrence',
  templateUrl: './create-ocurrence.component.html',
  styleUrls: ['./create-ocurrence.component.scss']
})
export class CreateOcurrenceComponent implements OnInit {

  public latitude = 123123.123;
  public longitude = 123123.123;
  dataLoaded: boolean = false;
  formOcurrence: FormGroup;

  public isNew = true;
  public id;
  constructor(private fb: FormBuilder, private ocurrenceService: OcurrenceService, private _snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isNew = false;
        this.id = params["id"];
        this.ocurrenceService.getById(params['id'])

          .subscribe(data => {
            this.formOcurrence = this.fb.group({
              description: [data.description, Validators.required],
              // zipCode: [data.zip_code, Validators.required],
              city: [data.city, Validators.required],
              neighborhood: [data.neighborhood, Validators.required],
              street: [data.street, Validators.required],
              number: [data.number, Validators.required],
              complement: [data.complement],
              // latitude: [data.latitude, Validators.required],
              // longitude: [data.longitude, Validators.required],
              type: [data.type, Validators.required],
              anonymous: [data.anonymous, Validators.required],
              ocurredAt: [new Date(data.ocurred_at), Validators.required],
            })
            this.dataLoaded = true;
          })
      } else {
        this.formOcurrence = this.fb.group({
          description: ['', Validators.required],
          // zipCode: ['', Validators.required],
          city: ['', Validators.required],
          neighborhood: ['', Validators.required],
          street: ['', Validators.required],
          number: ['', Validators.required],
          complement: [''],
          // latitude: ['', Validators.required],
          // longitude: ['', Validators.required],
          type: ['assalto', Validators.required],
          anonymous: [false, Validators.required],
          ocurredAt: [false, Validators.required],
        })
        this.dataLoaded = true;
        navigator.geolocation.getCurrentPosition(resp => {
          console.log(resp);
          this.longitude = resp.coords.longitude;
          this.latitude = resp.coords.latitude;
          this.formOcurrence.patchValue({ latitude: this.latitude, longitude: this.longitude })
        },
          err => {
            console.log(err);
          });
      }

    })
  }


  async onSubmitOcurrence() {
    if (this.formOcurrence.valid) {

      
      let data = {
        description: this.formOcurrence.get('description').value,
        zip_code: '84025000',
        city: this.formOcurrence.get('city').value,
        neighborhood: this.formOcurrence.get('neighborhood').value,
        street: this.formOcurrence.get('street').value,
        number: this.formOcurrence.get('number').value,
        complement: this.formOcurrence.get('complement').value,
        type: this.formOcurrence.get('type').value,
        anonymous: this.formOcurrence.get('anonymous').value,
        ocurred_at: this.formOcurrence.get('ocurredAt').value.getTime(),
        latitude: -25,
        longitude: -50
      }


      let address = encodeURIComponent(`${data.street} ${data.number} ${data.city}`);

      this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyA7cJl4xoi-L4gUj12t9_BO0ajI_vcWXNQ')
        .subscribe(mapsData => {
          if (mapsData.results.length > 0) {
            data.latitude = mapsData.results[0].geometry.location.lat;
            data.longitude = mapsData.results[0].geometry.location.lng;
            console.log(data);
          }

          if (this.isNew) {
            this.ocurrenceService.create(data)
              .subscribe(data => {
                this._snackBar.open('Ocorrência criada', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
                this.router.navigate(['ocurrences'])
              },
                error => {
                  this._snackBar.open('Erro ao criar ocorrência', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
                })
          } else {
            //@ts-ignore
            data._id = this.id;
            this.ocurrenceService.update(data)
              .subscribe(data => {
                this._snackBar.open('Ocorrência criada', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
                this.router.navigate(['ocurrences'])
              },
                error => {
                  this._snackBar.open('Erro ao criar ocorrência', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
                })

          }
        })






    }
  }


}
