import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { userdata } from '../././_model/userdata';
import { environment } from 'environments/environment';
import { PaymentService } from './payment.service';

@Component({
  selector: 'upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
formdata: any ={};
  name: any;
  loader: boolean;
  stripeHandler: any; // stripe handler object
  selectedAmount = 0;
  plan: any;
  plans = {
    pro: {
      id: 'reeva_29',
      name: 'Pro Plan',
      description: '$29.00 per month',
      amount: 2900 // == $29
    },
    guru: {
      id: 'reeva_99',
      name: 'Guru Plan',
      description: '$99.00 per month',
      amount: 9900 // == $99
    }
  };
  @HostListener('window:popstate')
    onPopstate() {
      // if user clicks back button or etc then close the payment modal.
      this.stripeHandler.close();
      this.selectedAmount = 0;
    }

  constructor(public user: userdata, public af: AngularFireAuth, private router: Router,
    private paymentService: PaymentService,) {

     this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;
      this.loader = true;
      //this.getFirebaseData(this.name.uid, user);
      }
     });

     this.stripeHandler = /*(<any>window).*/StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: (token: any) => {
        console.log('token', token);
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
       // this.paymentService.processPayment(token, this.selectedAmount);
       this.paymentService.processPayment(token, this.plan);
      }
    });
 }

  ngOnInit() {
  }
openCheckout(key: string) {
    this.selectedAmount = this.plans[key].amount;
    this.plan = this.plans[key];
    console.log(this.plan);
    this.stripeHandler.open(Object.assign({}, this.plans[key], {
      allowRememberMe: false,
      currency: 'usd'
    }));
  }
}
