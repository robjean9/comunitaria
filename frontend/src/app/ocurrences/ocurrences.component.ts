import { Component, OnInit } from '@angular/core';
import { OcurrenceService } from '../services/ocurrence.service';

@Component({
  selector: 'app-ocurrences',
  templateUrl: './ocurrences.component.html',
  styleUrls: ['./ocurrences.component.scss']
})
export class OcurrencesComponent implements OnInit {

  ocurrences = [];

  constructor(private ocurrenceService: OcurrenceService) { }



  ngOnInit(): void {
    this.ocurrenceService.get()
    .subscribe(data=>{
      this.ocurrences = data;
    }, error=>{
      console.log(error);
    })
  }

}
