import { Component, AfterViewInit , HostBinding} from '@angular/core';
import {trigger,state, style,animate,transition} from '@angular/animations';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  animations: [
    trigger('JoinClass', [
      state('Joined', style({
        display: 'none',
      })),
      state('notJoined', style({
      })),
    ]),
  ]
})
export class VideosComponent implements AfterViewInit {
 

  schedules: Observable<any[]>;
  join = false;

  joinClass = {
    DisplayName : "",
    ClassId : "",
    email : "",
    
  }

  title = 'app';
  domain:string = "meet.jit.si";
  options: any;
  api: any;

  constructor(public db: AngularFirestore) { }

  

  ngAfterViewInit():void { }

  join_class(){
    this.db.collection('schedules').doc(this.joinClass.ClassId).ref.get().then(function (doc) {
      if (doc.exists) {
        
      } else {
        alert("There are no classes with this ID.Please schedule a class and try again");
        location.reload();
      }
    }).catch(function (error) {
      console.log("Somethig is not write", error);
      alert("Something is not Write");
    });

    this.options = {
      roomName: this.joinClass.ClassId,
      parentNode: document.querySelector('#meet'),
      userInfo: {
        email: this.joinClass.email,
        displayName: this.joinClass.DisplayName },
        interfaceConfigOverwrite: { 
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection','hangup','profile', 'chat', 'recording',   'settings', 'raisehand',
          'videoquality',  'invite',  'stats', 'shortcuts',
          'tileview',  'mute-everyone', 'security'
      ],
      SHOW_POWERED_BY: false,
      SHOW_PROMOTIONAL_CLOSE_PAGE: false,
      MOBILE_APP_PROMO: false
       },
       configOverwrite: { enableWelcomePage: false
      }
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options); 
    this.join = true;
    
  } 
 
  

  

}
