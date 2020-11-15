import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

export interface User { name: string; id: string; category:string; joined: string; img: string }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  private currentUserDocument: AngularFirestoreDocument<User>;
  userdetails: Observable<User>;

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
    
  }

  updateUser(user){
    this.currentUserDocument = this.afs.doc<User>(`users/${user.uid}`);
    this.userdetails = this.currentUserDocument.valueChanges();
  }

  addUser(user) {
    var joinedIntext, category;
    const usersDb = this.afs.doc(`users/${user.uid}`);
    this.afs.collection("users").doc(`${user.uid}`).ref.get()
    .then(async function(doc) {
      if(doc.data()){
        joinedIntext = await doc.data().joinedIn;
        category  = await doc.data().category;
      }else{
        joinedIntext = new Date();
        category = 'Student';
      }
      const newUser = {
        name: user.displayName, 
        id: user.uid, 
        joined: joinedIntext,
        category: category,
        img: user.photoURL
      }
      usersDb.set(newUser);
    });

    return this.updateUser(user);
  }

  changeCategory(user, category){
    const usersDb = this.afs.doc(`users/${user.uid}`);
    this.afs.collection("users").doc(`${user.uid}`).ref.get()
    .then(async function(doc) {
      const newUser = {
        category: category
      }
      usersDb.update(newUser);
    });
  }

  async login() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    return this.addUser(credential.user);
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
  }

}
