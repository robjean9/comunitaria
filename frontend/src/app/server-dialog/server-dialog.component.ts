import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-server-dialog',
  templateUrl: './server-dialog.component.html',
  styleUrls: ['./server-dialog.component.sass']
})
export class ServerDialogComponent implements OnInit {

  formServer: FormGroup;
  constructor(private fb: FormBuilder, private store: StoreService, public dialogRef: MatDialogRef<ServerDialogComponent>) { }

  ngOnInit(): void {
    this.formServer = this.fb.group({
      server: [this.store.server, Validators.pattern('^https?:\/\/(.*)')],
    });
  }


  setServer(){
    if(this.formServer.valid){
      this.store.setServer(this.formServer.get('server').value);
      this.dialogRef.close();
    }
  }

}
