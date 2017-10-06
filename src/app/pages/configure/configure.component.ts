import { Component, OnInit,ViewChild,ViewEncapsulation} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { userdata } from '../././_model/userdata';
import { NgUploaderOptions } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { Upload } from './upload.class';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  encapsulation: ViewEncapsulation.None,
 })
export class ConfigureComponent implements OnInit {
  public formdata: any = {};
  public confdata: any = {};
  private basePath: string = '/uploads';
  authUser: any;
  loader: boolean;
  public error: any;
  content : any ='Data Saved';
  selectedFile: File;
  currentUpload: any;
  modalRef : any;
  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profilePicture = 'assets/img/app/profile/Nasta.png';
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  constructor(public user: userdata, public af: AngularFireAuth,
    private router: Router, private db: AngularFireDatabase,
    private uploadService: UploadService,
    private modalService: NgbModal) {
    this.confdata.photoURL = this.profilePicture;
    this.af.authState.subscribe(auth => {
      if (auth) {
        this.authUser = auth;
        this.loader = true;
        this.getFirebaseData(this.authUser.uid, user);
      }
    
      
    });
  }
 openModal(content,cssClass) {
  this.modalRef = this.modalService.open(content , { windowClass:cssClass });
   setTimeout(() => { this.modalRef.close()
   },1500); 
    
   
  }
  ngOnInit() { 
 
  }

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
    let imgUrl;
    let filename = 'logo.png';
    firebase.database().ref(`users/${data}`).once('value').then(function (snapshot) {
      user = snapshot.val();
    }).then(sucess => {
      this.loader = false;
      this.confdata = user ? user : {};
      firebase.storage().ref().child(`${this.basePath}/${user ?user.profileImg:''}`).getDownloadURL().then(function(url) {
     imgUrl = url;
      }).then(sucess => {

      this.confdata.photoURL =imgUrl;
      });
      //this.uploadService.downloadprofImg().then(function(d){}
      // = "https://firebasestorage.googleapis.com/v0/b/reeva-d9399.appspot.com/o/uploads%2Flogo.png?alt=media&token=27262486-8a10-49ba-a351-de0326914e0f";
      
    });
  }

  onSubmit(formData) {
    this.updateProfilePicture(); // update picture (if changed)
    if (formData.valid) {
      const _formData = this.confdata;
      _formData.profileImg = this.selectedFile.name;
      firebase.database().ref(`users/${this.authUser.uid}`)
        .set(_formData)
        .then((success) => {
          
          this.getFirebaseData(this.authUser.uid, this.user);
          this.router.navigate(['/pages/configure']);
          this.openModal(this.content,'success-modal');
        }).catch((err) => {
          console.log(err);
          this.openModal('Failed, Try Again','failed-modal');
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
