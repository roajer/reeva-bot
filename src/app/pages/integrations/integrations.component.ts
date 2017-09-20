import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { MailChimpService } from '../../_service/mail-chimp.service';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  providers: [MailChimpService, HashLocationStrategy]
})
export class IntegrationsComponent implements OnInit {

  constructor(private _mailChimp: MailChimpService, private _activatedRoute: ActivatedRoute, private _router: Router,
    private _hashLocationStrategy: HashLocationStrategy, private location: Location, private _http: Http) { }

  ngOnInit() {
    let code = (new URL(location.href)).searchParams.get('code');
    if (code) {
      this._mailChimp.getAccessToken(code);
    }
  }

  connectMailChimp() {
    this._mailChimp.connect();
  }

  connectMailerLite() {
    let headers = new Headers();
    headers.append('X-MailerLite-ApiKey', '50a38d6493eefdc7a5a4bace60029308');
    this._http.get('http://api.mailerlite.com/api/v2/subscribers', { headers: headers }).subscribe(res => {
      console.log(res);
    })
  }

}
