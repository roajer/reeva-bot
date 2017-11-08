import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  public form:FormGroup;
  public name:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  error:any;
  signuperror:boolean = false;
  public submitted:boolean = false;
constructor(public af: AngularFireAuth,private router: Router,fb:FormBuilder) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    this.signuperror = false;
    if (this.form.valid) {
      console.log(this.form.value.email,this.form.value.passwords.password);
     this.af.auth.createUserWithEmailAndPassword(this.form.value.email,this.form.value.passwords.password).then(
        (success) => {
       console.log(success);

       var user = firebase.auth().currentUser;
       user.sendEmailVerification().then(function() {
         // Email sent.
       }).catch(function(error) {
         console.log(error);
       });

        this.router.navigate(['/pages/configure'])
      }).catch(
        (err) => {
       this.error = err;
       this.signuperror = true;
        console.log("error"+err);
      })
    }
  }

  loginFb() {
    this.af.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider
    ).then(
        (success) => {

        this.router.navigate(['/pages/dashboard']);
      }).catch(
        (err) => {
        this.error = err;
      })
  }


  loginGoogle() {
    this.af.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider ).then(
        (success) => {
         this.router.navigate(['/pages/dashboard']);
      }).catch(
        (err) => {
        this.error = err;
      })
  }

}
