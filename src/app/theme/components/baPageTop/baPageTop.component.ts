import {Component} from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import {GlobalState} from '../../../global.state';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  authUser: any;
  loader: boolean;

  constructor(public af: AngularFireAuth, private router: Router, private _state:GlobalState) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
      this.af.authState.subscribe(auth => {
      if (auth) {
        this.authUser = auth;
        this.loader = true;
       // this.getFirebaseData(this.authUser.uid, user);
      }
    });

  });

  }
  public signout(){

     this.af.auth.signOut();
     this.router.navigateByUrl('/login');
  }
  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  getProfileImage() {
    firebase.database().ref(`users/${this.authUser.uid}/imageurl`).once('value').then(function (snapshot) {
   //   user = snapshot.val();
    }).then(sucess => {

    });
  }

  getFirebaseData(data, user) {
    this.loader = true;
    firebase.database().ref(`users/${data}`).once('value').then(function (snapshot) {
      user = snapshot.val();
    }).then(sucess => {
      this.loader = false;
     // this.formdata = user;

    });
  }
}
