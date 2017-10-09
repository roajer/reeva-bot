import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Upload } from './upload.class';

@Injectable()
export class UploadService {

  authUser: any;
  loader: boolean;
    constructor(private db: AngularFireDatabase) {

    }

    private uid: string = firebase.auth().currentUser.uid;
    private basePath: string = '/uploads';
    uploads: FirebaseListObservable<Upload[]>;


    getUploads(query = {}) {
        this.uploads = this.db.list(this.basePath, {
            query,
        });
        return this.uploads;
    }

   downloadprofImg ()
    {
        let imgurl="";
        const filename = 'logo.png';
        const storageRef = firebase.storage().ref();
        storageRef.child(`${this.basePath}/${filename}`).getDownloadURL().then(function(url) {
           imgurl = url;
            return url;
        });
        }
    deleteUpload(upload: Upload) {
        this.deleteFileData(upload.$key)
            .then(() => {
                this.deleteFileStorage(upload.imagename);
            })
            .catch(error => console.log(error));
    }

    // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
    pushUpload(upload: Upload) {
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
              //  this.saveFileData(upload);

              firebase.database().ref('users'+'/'+this.uid +'/').update(upload).then((snap) => {}).catch(
               (err) => {
               console.log(err);
             });

                return undefined;
            },
        );
    }

    // Writes the file details to the realtime db
    private saveFileData(upload: Upload) {
        this.db.list(`${this.basePath}/`).push(upload);
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
