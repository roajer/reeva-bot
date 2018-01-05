import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { userdata } from '../././_model/userdata';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpService } from '../../_service/http.service';

import { D3Service, D3, Selection } from 'd3-ng2-service';


@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {

  private d3: D3;

  emailsListData: any[] = [];
  topicListData: any[] = [];

  productListData: any[] = [];
  queryListData: any[] = [];

  dateRangeForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  }, this.startDateNotGreaterThanEndDate);

  dateRangeTopicForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  }, this.startDateNotGreaterThanEndDate);

  dateRangeProductForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  }, this.startDateNotGreaterThanEndDate);

  dateRangeQueryForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  }, this.startDateNotGreaterThanEndDate);

  dateRangeFormSub: any;
  formdata: any = {};
  name: any;
  loader: boolean;

  constructor(
    public user: userdata,
    public af: AngularFireAuth,
    private router: Router,
    private httpService: HttpService,
    d3Service: D3Service
  ) {

    this.d3 = d3Service.getD3();

    this.af.authState.subscribe(auth => {
      if (auth) {
        this.name = auth;
        this.loader = true;
        //  this.getFirebaseData(this.name.uid, user);
      }
    });
  }

  ngOnInit() {
    this.fetchDateRangeData();
    this.dateRangeFormSub = this.dateRangeForm.valueChanges.subscribe((data) => {
      this.fetchDateRangeData();
    });

  }

  startDateNotGreaterThanEndDate(g: FormGroup) {
    return (new Date(g.get('startDate').value).getTime() <= new Date(g.get('endDate').value).getTime())
      ? null : { 'greaterStartDate': true };
  }

  fetchDateRangeData(event?: any) {
    if (this.dateRangeForm.valid && !this.dateRangeForm.errors) {
      /*  const data = JSON.stringify({
          startDate: new Date(this.dateRangeForm.value.startDate).toISOString(),
          endDate: new Date(this.dateRangeForm.value.endDate).toISOString(),
        });
      */
      const strDte = new Date(this.dateRangeForm.value.startDate).toISOString();
      const endDte = new Date(this.dateRangeForm.value.endDate).toISOString();
      const url = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=email&userid=${this.name.uid}&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', url);
      const subscriber = this.httpService.httpRequest({
        method: 'GET',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.emailsListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        subscriber.unsubscribe();
      }, failure => {
        subscriber.unsubscribe();
      });



      const topicurl = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=topic&userid=${this.name.uid}&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', topicurl);
      const topicsubscriber = this.httpService.httpRequest({
        method: 'GET',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.topicListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        topicsubscriber.unsubscribe();
      }, failure => {
        topicsubscriber.unsubscribe();
      });


      const producturl = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=product&userid=${this.name.uid}&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', producturl);
      const productsubscriber = this.httpService.httpRequest({
        method: 'POST',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.productListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        productsubscriber.unsubscribe();
      }, failure => {
        productsubscriber.unsubscribe();
      });


      const queryurl = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=queries&userid=${this.name.uid}&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', queryurl);
      const queriessubscriber = this.httpService.httpRequest({
        method: 'POST',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.queryListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        queriessubscriber.unsubscribe();
      }, failure => {
        queriessubscriber.unsubscribe();
      });


    }
  }


/*

  fetchDateRangeProductData(event?: any) {
    if (this.dateRangeProductForm.valid && !this.dateRangeProductForm.errors) {
      const strDte = new Date(this.dateRangeProductForm.value.startDate).toISOString();
      const endDte = new Date(this.dateRangeProductForm.value.endDate).toISOString();
      const url = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=product&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', url);
      const subscriber = this.httpService.httpRequest({
        method: 'GET',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.productListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        subscriber.unsubscribe();
      }, failure => {
        subscriber.unsubscribe();
      });
    }
  }


  fetchDateRangeQueryData(event?: any) {
    if (this.dateRangeQueryForm.valid && !this.dateRangeQueryForm.errors) {
      const strDte = new Date(this.dateRangeQueryForm.value.startDate).toISOString();
      const endDte = new Date(this.dateRangeQueryForm.value.endDate).toISOString();
      const url = ` https://us-central1-reeva-d9399.cloudfunctions.net/queryFunction?query=queries&strdate=${strDte}&enddate=${endDte}`;
      console.log('fetching api url', url);
      const subscriber = this.httpService.httpRequest({
        method: 'GET',
        url,
      }).subscribe(response => {
        console.log('response', response);
        if (response.data) {
          this.queryListData = response.data;
        } else {
          console.log('no data found in response.');
        }
        subscriber.unsubscribe();
      }, failure => {
        subscriber.unsubscribe();
      });
    }
  }
*/
  getcsv(queryData) {
    //this.emailsListData
    let csvArray = '';
    for (let m of this.emailsListData) {

    }
    /*const newArray = this.emailsListData.map(o => {
      return { name: o.userName, email: o.emailID, date: o.date };
    }); */



    var newArray = this.emailsListData.map(o => {
      return { name: o.userName, email: o.emailID, date: o.date };
    });

    let csvData = this.d3.csvFormat(newArray);
    let rows = this.d3.csvParseRows(csvData);
    csvData = this.d3.csvFormatRows(rows.slice(1,rows.length));
    // let csvData = this.d3.csvParseRows(string);

    console.log(csvData);
    let myBlob: Blob = new Blob([csvData], { type: 'text/csv' });
    let fileURL = URL.createObjectURL(myBlob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(myBlob, 'reeva.csv');
    } else {
      let a = document.createElement('a');
      a.href = fileURL;
      a.download = 'reeva.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(fileURL);

    // Cross your fingers at this point and pray whatever you're used to pray
    //window.open(fileURL);
    /*  for (let entry of queryData) {
        let csvString = '';
        csvString = csvString + queryData.userName + ",";
        console.log(entry); // 1, "string", false
        } */
  }

  /*  getFirebaseData(data, user) {
      this.loader = true;
      firebase.database().ref('users' + '/' + data).once('value').then(function (snapshot) {
        user = snapshot.val();

      }).then(sucess => {
        this.loader = false;
        this.formdata = user;

      });
    } */

  /* onSubmit(formData) {
     console.log(formData);
     if (formData.valid) {
       firebase.database().ref('users' + '/' + this.name.uid).set(formData.value).then(
         (success) => {
           this.formdata = {};

           this.getFirebaseData(this.name.uid, this.user);
           this.router.navigate(['/pages/dashboard']);
         }).catch(
         (err) => {
           console.log(err);
         });

     }
   } */

  ngOnDestroy() {
    if (this.dateRangeFormSub) { this.dateRangeFormSub.unsubscribe(); }
  }
}


