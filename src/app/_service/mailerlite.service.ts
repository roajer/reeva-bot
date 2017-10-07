import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

@Injectable()
export class MailerLiteService {
    private URL: string = "https://us-central1-reeva-d9399.cloudfunctions.net/mlGetListFunction?tokenid=";
    private uid: string = firebase.auth().currentUser.uid;

    constructor(private http: Http) { }

    connect(APIkey) {
        return this.http.get(this.URL + APIkey)
            .map(res => res.json());
    }

    saveAPIKey(ApiKey) {
        return firebase.database().ref(`/integrations/` + this.uid).set({
            emailProvider: 'mailerlite',
            access_token: ApiKey,
        });
    }

}