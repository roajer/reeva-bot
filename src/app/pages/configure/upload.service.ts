import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
//import { Upload } from './upload.class';
import { userdata } from '../././_model/userdata';

@Injectable()
export class UploadService {

  formdata: any = {};
  authUser: any;
  loader: boolean;

    constructor(public user: userdata, public af: AngularFireAuth, private db: AngularFireDatabase) {
      this.af.authState.subscribe(auth => {
      if (auth) {
        this.authUser = auth;
        this.loader = true;
        this.getFirebaseData(this.authUser.uid, user);
      }
    });
    }

    private basePath: string = `/users/`;
    uploads: FirebaseListObservable<userdata[]>;

getFirebaseData(data, user) {
    this.loader = true;
    firebase.database().ref(`users/${data}`).once('value').then(function (snapshot) {
      user = snapshot.val();
    }).then(sucess => {
      this.loader = false;
      this.formdata = user;
    });
  }

    getUploads(query = {}) {
        this.uploads = this.db.list(this.basePath, { query });
        return this.uploads;
    }


    deleteUpload(upload: userdata) {
        this.deleteFileData(upload.$key)
            .then(() => {
                this.deleteFileStorage(upload.imagename);
            })
            .catch(error => console.log(error));
    }

    // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
    pushUpload(upload: userdata) {
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // upload in progress
                const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            },
            (error) => {
                // upload failed
                console.log(error);
            },
            () => {
                // upload success
                upload.imageurl = uploadTask.snapshot.downloadURL;
                upload.imagename = upload.file.name;
                this.saveFileData(upload);
                return undefined;
            },
        );
    }


    // Writes the file details to the realtime db
    private saveFileData(upload: userdata) {
        //this.db.list(`${this.basePath}/`).push(upload);
        firebase.database().ref(`${this.basePath}/${this.authUser.uid}`).update(upload);
    }

    // Writes the file details to the realtime db
    private deleteFileData(key: string) {
        return this.db.list(`${this.basePath}/`).remove(key);
    }

    // Firebase files must have unique names in their respective storage dir
    // So the name serves as a unique key
    private deleteFileStorage(name: string) {
        const storageRef = firebase.storage().ref();
        storageRef.child(`${this.basePath}/${name}`).delete();
    }


}
