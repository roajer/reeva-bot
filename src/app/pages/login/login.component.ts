import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  public error :any;

     constructor(public af: AngularFireAuth,private router: Router,fb:FormBuilder) {
      this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    })
      this.af.authState.subscribe(auth => {
      if(auth) {
        this.router.navigateByUrl('/members');
      }
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
     }

  public onSubmit(values:Object):void {
    this.submitted = true;

    if (this.form.valid) {
      // your code goes here
      // console.log(values);
       this.af.auth.signInWithEmailAndPassword(this.email.value,this.password.value)
      .then(
        (success) => {
       console.log(success);
       this.router.navigate(['/pages/dashboard']);
      }).catch(
        (err) => {

        this.error = err;
      })
    }
  }

 loginFb() {
    this.af.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider
    ).then(
        (success) => {

        this.router.navigate(['/pages']);
      }).catch(
        (err) => {
        this.error = err;
      })
  }


  loginGoogle() {
    this.af.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider ).then(
        (success) => {
         this.router.navigate(['/pages']);
      }).catch(
        (err) => {
        this.error = err;
      })
  }

  forgotPassword(emailAddress){
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
    }).catch(function(error) {
      console.log(error);
    });
  }

  changePassword(newPassword){
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(function() {
      // Update successful.
    }).catch(function(error) {
      console.log(error);
      // An error happened.
    });

  }

}
