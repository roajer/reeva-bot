import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { GlobalState } from '../../../global.state';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  imageUrl: string;

  constructor(public af: AngularFireAuth, private router: Router, private _state: GlobalState) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    let localthis = this;
    this.af.authState.subscribe(auth => {
      firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        localthis.imageUrl = snapshot.val().imageurl;
        // console.log(snapshot.val());
      });
    });

  }

  public signout() {

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
}
