import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public form: FormGroup;
  public email: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.email = this.form.controls['email'];
    
  }

  ngOnInit() { }

  forgotPassword(emailAddress) {
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(emailAddress).then(function (res) {
      console.log('mail sent');
      console.log(res);
      // Email sent.
    }).catch(function (error) {
      console.log(error);
    });
  }

}
