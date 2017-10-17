import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import * as firebase from 'firebase/app';

@Injectable()
export class MailChimpService {

  private ClientId: string = "228783371578";
  private ClientSecret: string = "5e0711480c62aa81f3d63992ad4bceb48f97409e2894bb0dfd";
  private uid: string = firebase.auth().currentUser.uid;
  private authorize_uri: string = "https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=228783371578"
  private access_token_uri: string = `https://us-central1-reeva-d9399.cloudfunctions.net/mcKeyFunction?userid=${this.uid}&code=`
  private get_list_uri: string = `https://us-central1-reeva-d9399.cloudfunctions.net/mcGetListFunction?userid=${this.uid}`;

  // private access_token_uri: string = "https://login.mailchimp.com/oauth2/token";
  // private firebase_access_token_uri: string = "https://us-central1-reeva-d9399.cloudfunctions.net/mcKeyFunction?code=";
  // private meta_uri: string = "https://login.mailchimp.com/oauth2/metadata";

  constructor(private _http: Http) { }

  connect() {
    window.open(this.authorize_uri, '_blank', 'location=yes,height=570,width=520,scrollbars=yes');    // window.location.href = this.authorize_uri;
  }

  getAccessToken(code) {
    return this._http.get(this.access_token_uri + code).
      map(res => res.json())
      // .map(res => console.log('token res' + JSON.stringify(res)))
      .flatMap(() => this.getListData())
  }

  getListData() {
    return this._http.get(this.get_list_uri).map(res => res.json());
  }

  saveListId(listId) {
    return firebase.database().ref(`/integrations/` + this.uid + '/').update({
      listId
    });
  }

}
