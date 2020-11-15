import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent implements OnInit {
  schedule:any;

  scheduleClass = {
    HostName : "",
    Title : "",
    email : "",
    
  }

  constructor(public db: AngularFirestore) { }

  add_class(){
    this.db.collection("schedules").add({
      firstName : this.scheduleClass.HostName,
      lastName : this.scheduleClass.Title,
      email : this.scheduleClass.email
      
  })
  .then(function() {
    alert("YourClass is succesfully scheduled");

  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
      alert("There Is An Error While Adding Your Class")
  });
}

  ngOnInit(): void {
  }

}
