import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { Observable, Timestamp } from 'rxjs';
import { finalize } from 'rxjs/operators';


import { AngularFireStorage } from '@angular/fire/storage';

export interface User { name: string; id: string; uid:string; category:string; joined: string; img: string }
export interface Chattype {
  id: number,
  sent: Timestamp<1>,
  sentBy: boolean,
  sender: string,
  message: string,
  image: string,
}

@Component({
  selector: 'app-chat-id',
  templateUrl: './chat-id.component.html',
  styleUrls: ['./chat-id.component.scss']
})
export class ChatIDComponent implements OnInit {
  private sub: any;
  idnum: any;
  private userDoc: AngularFirestoreDocument<User>;
  friend: Observable<User>;
  private msgsCollection: AngularFirestoreCollection<Chattype>;
  messageitems: Observable<Chattype[]>;
  chat = '';
  imgSrc: string = '';
  
  imageURL = new FormControl('');
  selectedimgURL: any = null;



  constructor(private route: ActivatedRoute, private router: Router, private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage){ 
    this.sub = this.route.params.subscribe(async params => {
      this.idnum = params.id;
      this.userDoc = this.afs.doc<User>(`users/${params.id}`);
      this.friend = this.userDoc.valueChanges();
      let currentUser =  await this.afAuth.currentUser;
      this.loadMessages(currentUser.uid, this.idnum);
    });
  }

  async loadMessages(uid, rid){
    this.msgsCollection = this.afs.collection<Chattype>(`messages/privateChats/${uid}/${rid}/messages`, ref => ref.orderBy('id'));
    this.messageitems = this.msgsCollection.valueChanges();
  }

  scrolladjust(){
    var scrollbar = document.getElementById('chat-area');
    scrollbar.scrollTop = scrollbar.scrollHeight;
  }


  showImg(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedimgURL = event.target.files[0];
    }else{
      this.imgSrc = '';
      this.selectedimgURL = null;
    }
  }

  imgclear(){
    this.imgSrc = '';
    this.selectedimgURL = null;
  }

  ngAfterViewChecked(){
    this.scrolladjust();
  }

  ngOnInit(): void {
    
  }

  
  async sendMessage(){
    this.sub = this.route.params.subscribe(async params => {
      this.idnum = params.id;
      this.userDoc = this.afs.doc<User>(`users/${params.id}`);
      this.friend = this.userDoc.valueChanges();  
      const currentUser = await this.afAuth.currentUser;
      if(this.selectedimgURL){
        return this.sendimg(currentUser.uid, this.idnum, this.chat, this.selectedimgURL);
      }else{
        return this.checkmsg(currentUser.uid, this.idnum, this.chat);
      }
    });
}

sendStar(){
  this.sub = this.route.params.subscribe(async params => {
    this.idnum = params.id;
    this.userDoc = this.afs.doc<User>(`users/${params.id}`);
    this.friend = this.userDoc.valueChanges();  
    const currentUser = await this.afAuth.currentUser;
      return this.sendStartoDB(currentUser.uid, this.idnum);
  });
   
}

sendStartoDB(uid, rid){
  const PMessagesinfo = this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`);
  const PRMessagesinfo = this.afs.collection(`messages/privateChats/${rid}`).doc(`${uid}`);
  const PMessageschats = this.afs.collection(`messages/privateChats/${uid}/${rid}/messages`);
  const PRMessageschats = this.afs.collection(`messages/privateChats/${rid}/${uid}/messages`);

  this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`).ref.get()
  .then(async function(doc) {
    if(doc.data()){
      // console.log('yes')
      const chatdetail = {
        id: doc.data().id + 1,
        lasttext: '',
        image: false,
        star: true,
        sentBy: true,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PMessagesinfo.set(chatdetail)

      const chatRdetail = {
        id: doc.data().id + 1,
        lasttext: '',
        image: false,
        star: true,
        sentBy: false,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PRMessagesinfo.set(chatRdetail)
      
      const chatmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        sentBy: true,
        sender: uid,
        star: true,
        message: ''
      }

      PMessageschats.add(chatmessage)

      const chatRmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        sentBy: false,
        sender: uid,
        star: true,
        message: ''
      }

      PRMessageschats.add(chatRmessage)
    }else{
      // console.log('null');
        const chatdetail = {
          id: 1,
          lasttext: '',
          image: false,
          star: true,
          sentBy: true,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PMessagesinfo.set(chatdetail)

        const chatRdetail = {
          id: 1,
          lasttext: '',
          image: false,
          sentBy: false,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PRMessagesinfo.set(chatRdetail)
        
        const chatmessage = {
          id: 1,
          sent: new Date(),
          sentBy: true,
          sender: uid,
          star: true,
          message: ''
        }

        PMessageschats.add(chatmessage)

        const chatRmessage = {
          id: 1,
          sent: new Date(),
          sentBy: false,
          sender: uid,
          star: true,
          message: ''
        }

        PRMessageschats.add(chatRmessage)
      }
    
  });
}

checkmsg(uid, rid, chatm){
  const PMessagesinfo = this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`);
  const PRMessagesinfo = this.afs.collection(`messages/privateChats/${rid}`).doc(`${uid}`);
  const PMessageschats = this.afs.collection(`messages/privateChats/${uid}/${rid}/messages`);
  const PRMessageschats = this.afs.collection(`messages/privateChats/${rid}/${uid}/messages`);
  this.chat = '';

  this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`).ref.get()
  .then(async function(doc) {
    if(doc.data()){
      // console.log('yes')
      if(chatm){
      const chatdetail = {
        id: doc.data().id + 1,
        lasttext: chatm,
        image: false,
        sentBy: true,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PMessagesinfo.set(chatdetail)

      const chatRdetail = {
        id: doc.data().id + 1,
        lasttext: chatm,
        image: false,
        sentBy: false,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PRMessagesinfo.set(chatRdetail)
      
      const chatmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        sentBy: true,
        sender: uid,
        message: chatm
      }

      PMessageschats.add(chatmessage)

      const chatRmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        sentBy: false,
        sender: uid,
        message: chatm
      }

      PRMessageschats.add(chatRmessage)
    }
    }else{
      // console.log('null');
      if(chatm){
        const chatdetail = {
          id: 1,
          lasttext: chatm,
          image: false,
          sentBy: true,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PMessagesinfo.set(chatdetail)

        const chatRdetail = {
          id: 1,
          lasttext: chatm,
          image: false,
          sentBy: false,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PRMessagesinfo.set(chatRdetail)
        
        const chatmessage = {
          id: 1,
          sent: new Date(),
          sentBy: true,
          sender: uid,
          message: chatm
        }

        PMessageschats.add(chatmessage)

        const chatRmessage = {
          id: 1,
          sent: new Date(),
          sentBy: false,
          sender: uid,
          message: chatm
        }

        PRMessageschats.add(chatRmessage)
      }
    }
    
  });
}

// sendimg(uid, rid, chatm, imgurl){
//   if(this.imageURL.valid){
//     var filePath = `${uid}/${rid}/${imgurl.name}_${new Date()}`;
//     const fileRef = this.storage.ref(filePath);
//     this.storage.upload(filePath, imgurl).snapshotChanges().pipe(
//       finalize(()=>{
//         fileRef.getDownloadURL().subscribe((url)=>{
//           const urlStorage = url;
//           this.imageURL.reset();
//           this.imgSrc = '';
//           this.selectedimgURL = null;

//           this.checkmsgimg(uid, rid, chatm, urlStorage);
//         })
//       })
//     ).subscribe();     
//   }

// }

checkmsgimg(uid, rid, chatm, url){
  const PMessagesinfo = this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`);
  const PRMessagesinfo = this.afs.collection(`messages/privateChats/${rid}`).doc(`${uid}`);
  const PMessageschats = this.afs.collection(`messages/privateChats/${uid}/${rid}/messages`);
  const PRMessageschats = this.afs.collection(`messages/privateChats/${rid}/${uid}/messages`);
  this.chat = '';

  this.afs.collection(`messages/privateChats/${uid}`).doc(`${rid}`).ref.get()
  .then(async function(doc) {
    if(doc.data()){
      // console.log('yes')
      const chatdetail = {
        id: doc.data().id + 1,
        lasttext: chatm,
        image: true,
        sentBy: true,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PMessagesinfo.set(chatdetail)

      const chatRdetail = {
        id: doc.data().id + 1,
        lasttext: chatm,
        image: true,
        sentBy: false,
        sender: uid,
        lastdate: new Date(),
        typing: false,
        messages: doc.data().messages + 1
      };
      PRMessagesinfo.set(chatRdetail)
      
      const chatmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        image: url,
        sentBy: true,
        sender: uid,
        message: chatm
      }

      PMessageschats.add(chatmessage)

      const chatRmessage = {
        id: doc.data().messages + 1,
        sent: new Date(),
        image: url,
        sentBy: false,
        sender: uid,
        message: chatm
      }

      PRMessageschats.add(chatRmessage)
    }else{
      // console.log('null');
        const chatdetail = {
          id: 1,
          lasttext: chatm,
          image: true,
          sentBy: true,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PMessagesinfo.set(chatdetail)

        const chatRdetail = {
          id: 1,
          lasttext: chatm,
          image: true,
          sentBy: false,
          sender: uid,
          lastdate: new Date(),
          typing: false,
          messages: 1
        };
        PRMessagesinfo.set(chatRdetail)
        
        const chatmessage = {
          id: 1,
          sent: new Date(),
          image: url,
          sentBy: true,
          sender: uid,
          message: chatm
        }

        PMessageschats.add(chatmessage)

        const chatRmessage = {
          id: 1,
          sent: new Date(),
          image: url,
          sentBy: false,
          sender: uid,
          message: chatm
        }

        PRMessageschats.add(chatRmessage)
    }
    
  });
}

// createMessage(chat: Chat){
//   return ;
// }

ngOnDestroy() {
  this.sub.unsubscribe();
}

}
