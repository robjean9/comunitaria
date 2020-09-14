import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OcurrenceService } from '../services/ocurrence.service';

@Component({
  selector: 'app-ocurrences',
  templateUrl: './ocurrences.component.html',
  styleUrls: ['./ocurrences.component.scss']
})
export class OcurrencesComponent implements OnInit {

  ocurrences = [];

  constructor(private ocurrenceService: OcurrenceService, private router:Router) { }



  ngOnInit(): void {
    this.ocurrenceService.get()
    .subscribe(data=>{
      this.ocurrences = data;
    }, error=>{
      console.log(error);
    })
  }
  

  newOcurrence(){
    this.router.navigate(['ocurrences/create'])
  }

}
