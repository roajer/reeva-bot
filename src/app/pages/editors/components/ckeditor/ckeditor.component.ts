import { Component,OnInit } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import './ckeditor.loader';
import 'ckeditor';
import { userdata } from '../model/user';

@Component({
  selector: 'ckeditor-component',
  templateUrl: './ckeditor.html',
  styleUrls: ['./ckeditor.scss']
})

export class Ckeditor implements OnInit {
  formdata: any ={};
  name: any;
  param:any ={};

  public ckeditorContent:string = '<p>Hello CKEditor</p>';
  public config = {
    uiColor: '#F0F3F4',
    height: '600',
  };

 constructor(public user: userdata, public af: AngularFireAuth) {

     this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;

       firebase.database().ref('users'+'/'+this.name.uid).once('value').then(function(snapshot) {
       user = snapshot.val();
      // console.log(snapshot.val());
  }).then(sucess =>
  {
   this.formdata = user;
  }
  );
      }
     });

 }

 /* getAuthorization(){

  return  this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;

       this.param = this.name;

      console.log(this.name.uid);
        firebase.database().ref('users'+'/'+this.name.uid).once('value').then(function(snapshot) {
        console.log(snapshot.val());

  });}
    });
  }*/

  onSubmit(formData) {
    console.log(formData.value);
    if(formData.valid)
    console.log(formData.value.email);
    else
      console.log("invalid");
    firebase.database().ref('users'+'/'+this.name.uid).set(formData.value).then(
        (success) => {
       console.log(success);
      }).catch(
        (err) => {
        console.log( err);
      });

  }

  ngOnInit() {


}




}
