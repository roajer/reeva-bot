import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { userdata } from '../././_model/userdata';
import { NgUploaderOptions } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { Upload } from './upload.class';

@Component({
  selector: 'configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  formdata: any = {};
  authUser: any;
  loader: boolean;

  public error: any;


  selectedFile: File;
  currentUpload: any;

  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profilePicture = 'assets/img/app/profile/Nasta.png';
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  constructor(public user: userdata, public af: AngularFireAuth,
    private router: Router, private db: AngularFireDatabase,
    private uploadService: UploadService) {
    this.formdata.photoURL = this.profilePicture;
    this.af.authState.subscribe(auth => {
      if (auth) {
        this.authUser = auth;
        this.loader = true;
        this.getFirebaseData(this.authUser.uid, user);
      }
    });
  }

  ngOnInit() { }

  onPictureChanged(event: any) {
    this.profilePicture = event.data;
    this.selectedFile = event.file;
  }

  uploadPicture() { // upload new selected picture.
    if (this.selectedFile) {
      this.currentUpload = new Upload(this.selectedFile);
      this.uploadService.pushUpload(this.currentUpload);
    }
  }

  updateProfilePicture() {
    this.uploadPicture(); // upload picture (if changed)
    const uploadOpts = this.currentUpload && this.currentUpload.url ? { photoURL: this.currentUpload.url } : null;
    if (uploadOpts) { // upload photoURL for user as well..
      firebase.database().ref(`users/${this.authUser.uid}`)
        .set(uploadOpts)
        .then((success) => {
          this.resetPictureUploadConfig();
        }).catch((err) => {
          console.log(err);
          this.resetPictureUploadConfig();
        });
    }
  }

  resetPictureUploadConfig() {
    this.currentUpload = null;
    this.selectedFile = null;
  }

  getFirebaseData(data, user) {
    this.loader = true;
    firebase.database().ref(`users/${data}`).once('value').then(function (snapshot) {
      user = snapshot.val();
    }).then(sucess => {
      this.loader = false;
      this.formdata = user;
    });
  }

  onSubmit(formData) {
    this.updateProfilePicture(); // update picture (if changed)
    if (formData.valid) {
      const _formData = formData.value;
      firebase.database().ref(`users/${this.authUser.uid}`)
        .set(_formData)
        .then((success) => {
          this.formdata = {};
          this.getFirebaseData(this.authUser.uid, this.user);
          this.router.navigate(['/pages/configure']);
        }).catch((err) => {
          console.log(err);
        });
    }
  }

  loginGoogle() {
    this.af.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
        .addScope('https://www.googleapis.com/auth/analytics'))
      .then((success) => {
        console.log(success.credential.accessToken);
        this.router.navigate(['/pages/configure']);
      })
      .catch((err) => {
        this.error = err;
      });
  }

}
