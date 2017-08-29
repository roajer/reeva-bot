import {Component,OnInit} from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { userdata } from '../././_model/userdata';
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit  {

  formdata: any ={};
  name: any;
  loader: boolean;
 constructor(public user: userdata, public af: AngularFireAuth, private router: Router) {

     this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;
      this.loader = true;
      this.getFirebaseData(this.name.uid, user);
      }
     });

 }

 getFirebaseData(data,user)
 {
   this.loader=true;
     firebase.database().ref('users'+'/'+data).once('value').then(function(snapshot) {
       user = snapshot.val();

  }).then(sucess =>
  {
    this.loader=false;
   this.formdata = user;

  });

 }

  onSubmit(formData) {
console.log(formData);
    if(formData.valid)
   {
    firebase.database().ref('users'+'/'+this.name.uid).set(formData.value).then(
        (success) => {
    this.formdata ={};

      this.getFirebaseData(this.name.uid,this.user);
        this.router.navigate(['/pages/dashboard']);
      }).catch(
        (err) => {
        console.log(err);
      });

  }
  }
  ngOnInit()
  {

  }
}
