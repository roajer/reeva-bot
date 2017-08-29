import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { environment } from 'environments/environment';

@Injectable()
export class PaymentService {
    userId: string;

    constructor(private af: AngularFireAuth, private db: AngularFireDatabase) {
        this.af.authState.subscribe(auth => {
            if (auth) {
                this.userId = auth.uid;
            }
        });
    }

    // This will save the stripe token to firebase, triggering the cloud function
    processPayment(token: any, plan) {
        const payment = { token, plan };
         console.log('payment:', payment);

        return firebase.database().ref(`/payments/${this.userId}`).set(payment);
        //return this.db.list(`/payments/${this.userId}`).push(payment);
    }

}
