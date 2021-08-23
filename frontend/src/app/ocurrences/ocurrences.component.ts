import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OcurrenceService } from '../services/ocurrence.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-ocurrences',
  templateUrl: './ocurrences.component.html',
  styleUrls: ['./ocurrences.component.scss']
})
export class OcurrencesComponent implements OnInit {

  ocurrences = [];

  public isMy = false;

  @ViewChild(MapInfoWindow, {static:false}) infoWindow: MapInfoWindow;
  constructor(private ocurrenceService: OcurrenceService, private router:Router, private route: ActivatedRoute,  private _snackBar: MatSnackBar, public auth: AuthService, private store: StoreService) { }



  ngOnInit(): void {

   this.loadOcurrences();

  }

  loadOcurrences(){

    if(this.route.routeConfig.path === 'ocurrences/me'){
      this.isMy = true;
      this.ocurrenceService.getMyOcurrences()
      .subscribe(data=>{
        this.ocurrences = data;
      }, error=>{
        console.log(error);
      })
    }else{
      this.ocurrenceService.get()
      .subscribe(data=>{
        this.ocurrences = data;
      }, error=>{
        console.log(error);
      })
    }
  }
  

  newOcurrence(){
    this.router.navigate(['ocurrences/create'])
  }


  deleteOcurrence(id){
    this.ocurrenceService.delete(id)
    .subscribe(data=>{
      this._snackBar.open('Ocorrência excluída', 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
      this.loadOcurrences();
    })
  }

  editOcurrence(id){
    this.router.navigate([`ocurrences/${id}`])
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  comment(text, id, idx){
    this.ocurrenceService.comment(id,text)
    .subscribe(data=>{
      this.loadOcurrences();
    })
  }

  vote(id, vote){
    this.ocurrenceService.vote(id, vote)
    .subscribe(data=> {
      this.loadOcurrences();
    },err=>
    this._snackBar.open(err.error, 'OK', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' })

    )
  }


}
