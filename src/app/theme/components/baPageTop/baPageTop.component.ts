import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { GlobalState } from '../../../global.state';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../theme/validators';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  public myform: FormGroup;
  public newPassword: AbstractControl;
  public repeatPassword: AbstractControl;
  modalRef: NgbModalRef;
  // public passwords: FormGroup;
  imageUrl: string = '../../../../assets/img/theme/no-photo.png';

  constructor(public af: AngularFireAuth, private router: Router, private _state: GlobalState, private _modalService: NgbModal,
    fb: FormBuilder, private _notificationsService: NotificationsService) {
    this.myform = fb.group({
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    }, { validator: EqualPasswordsValidator.validate('newPassword', 'repeatPassword') });

    this.newPassword = this.myform.controls['newPassword'];
    this.repeatPassword = this.myform.controls['repeatPassword'];

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    let localthis = this;
    this.af.authState.subscribe(auth => {
      firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).once('value').then(function (snapshot) {
        if (snapshot.val() && snapshot.val().imageurl)
          localthis.imageUrl = snapshot.val().imageurl;
        // console.log(snapshot.val());
      });
    });
  }

  changePassword(content) {
    this.modalRef = this._modalService.open(content);
  }

  public onSubmit(values: any): void {
    const localthis = this;
    if (this.myform.valid) {
      console.log(values);
      var user = firebase.auth().currentUser;
      user.updatePassword(values.newPassword).then(function () {
        localthis._notificationsService.success('Success', 'Password changed successfully!!');
        localthis.modalRef.close();
      }).catch(function (error) {
        localthis.modalRef.close();
        localthis._notificationsService.error('Oops!', error.message);
      });
    } else {
      console.log(this.myform.errors);
    }
  }

  changePasswordFirebase(newPassword) {
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(function () {
      // Update successful.
    }).catch(function (error) {
      console.log(error);
      // An error happened.
    });

  }

  public signout() {
    this.af.auth.signOut();
    this.router.navigateByUrl('/login');
  }
  // public toggleMenu() {
  //   this.isMenuCollapsed = !this.isMenuCollapsed;
  //   this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  //   return false;
  // }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
}
