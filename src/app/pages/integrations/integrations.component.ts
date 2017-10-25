import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { MailChimpService } from '../../_service/mail-chimp.service';
import * as firebase from 'firebase/app';
import { MailerLiteService } from '../../_service/mailerlite.service';
import { Http, Headers } from '@angular/http';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  providers: [MailChimpService, MailerLiteService]
})
export class IntegrationsComponent implements OnInit {

  modalRef: NgbModalRef;
  private uid: string = firebase.auth().currentUser.uid;
  @ViewChild('mailChimpContent') mailChimpModal: ElementRef;
  // items = [];
  list = [];
  SelectedValue;
  emailProvider: string = "";

  constructor(private _mailChimpService: MailChimpService, private _activatedRoute: ActivatedRoute, private _router: Router,
    private _http: Http, private _modalService: NgbModal, private _mailerLiteService: MailerLiteService) { }

  ngOnInit() {
    let code = (new URL(location.href)).searchParams.get('code');
    if (code) {
      if (parent.window && parent.window.opener) {
        parent.window.opener.location.replace(location.href);
        window.close();
      }
      this._mailChimpService.getAccessToken(code).subscribe((listData: any) => {
        this.list = listData;
        this._modalService.open(this.mailChimpModal).result.then(result => {
          if (this.SelectedValue) {
            console.log(this.SelectedValue);
            this._mailChimpService.saveListId(this.SelectedValue.id).then(result => {
              this.resetAssets();
              this.getUserData();
              if (window.history.replaceState) {
                window.history.replaceState({}, "", window.location.toString().replace(window.location.search, ""));
              }
            });
          }
        }).catch(err => {
          if (window.history.replaceState) {
            window.history.replaceState({}, "", window.location.toString().replace(window.location.search, ""));
            this.resetAssets();
          }
        });
      });
    }
    this.getUserData();
  }

  connectMailChimp() {
    this._mailChimpService.connect();
  }

  getUserData() {
    const localthis = this;
    firebase.database().ref(`integrations/${this.uid}`).once('value').then(function (snapshot) {
      console.log(snapshot.val());
      //throwing null
      localthis.emailProvider = snapshot.val().emailProvider;
    });
  }


  getList(apiKey) {
    this._mailerLiteService.getDataList(apiKey).subscribe(value => this.list = value);
  }

  connectMailerLite(content) {
    this._modalService.open(content).result.then(result => {
      this._mailerLiteService.saveAPIKey(result, this.SelectedValue.id).then(result => {
        this.resetAssets();
        this.getUserData();
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  resetAssets() {
    this.SelectedValue = '';
    this.list = [];
  }

}
