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
  items = [];
  emailProvider: string = "";

  constructor(private _mailChimp: MailChimpService, private _activatedRoute: ActivatedRoute, private _router: Router,
    private _http: Http, private _modalService: NgbModal, private _mailerLiteService: MailerLiteService) { }

  ngOnInit() {
    let code = (new URL(location.href)).searchParams.get('code');
    if (code) {
      this._mailChimp.getAccessToken(code).subscribe((listData: any) => {
        console.log(listData);
        this.items = listData;
        const modalRef = this._modalService.open(this.mailChimpModal);
      });
    }
    this.getUserData();
  }

  connectMailChimp() {
    this._mailChimp.connect();
  }

  getUserData() {
    const localthis = this;
    firebase.database().ref(`integrations/${this.uid}`).once('value').then(function (snapshot) {
      console.log(snapshot.val());
      localthis.emailProvider = snapshot.val().emailProvider;
    });
  }

  connectMailerLite(content) {
    const modalRef = this._modalService.open(content).result.then(result => {
      if (result) {
        this._mailerLiteService.saveAPIKey(result).then(result => console.log(result))
          .catch(err => console.log(err));
        // .subscribe(res => console.log(res));
      }
    }).catch(err => console.log(err));
  }

}