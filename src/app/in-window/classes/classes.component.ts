import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit { 

  classes: Observable<any[]>;
 
  
  constructor(firestore: AngularFirestore) { 
    this.classes = firestore.collection('classes').valueChanges();
     
  }

  

  ngOnInit(): void {
  }
 


}
