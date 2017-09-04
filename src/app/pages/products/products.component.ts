import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { productsdata } from '../././_model/productsdata';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';

import { Validators, FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';



@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

myForm: FormGroup;

autocompleteItems: any;


  query: string = '';

  formdata: any ={};
  name: any;
  loader: boolean;

// In one of your component ts file

 constructor(public user: productsdata, public af: AngularFireAuth, private router: Router,
     private _fb: FormBuilder, private http: Http) {

     this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;
      this.loader = true;
      this.getFirebaseData(this.name.uid, user);
      }
     });

    // this.service.getData().then((data) => {
    //  this.source.load(data);
 //   });


 }

 extractTagNameFromJson(res: Response) {
		let tagNamesJson = res.json();
		let tagNames = new Array();
		for (let item of tagNamesJson){
            tagNames.push(item.name);
		}
		return tagNames || {};
	}

 getFirebaseData(data, user) {
   this.loader = true;
     firebase.database().ref('products'+'/'+data).once('value').then(function(snapshot) {
       user = snapshot.val();

  }).then(sucess => {
    this.loader = false;
   this.formdata = user;

  });
 }


 // save(model: productsdata) {
        // call API to save customer
   //     console.log(model);
  //  }

  onSubmit(formData) {

    if(formData.valid)
   {
    firebase.database().ref('products'+'/'+this.name.uid).push().set(formData.value).then(
        (success) => {
    this.formdata ={};

      this.getFirebaseData(this.name.uid, this.user);
        this.router.navigate(['/pages/products']);
      }).catch(
        (err) => {
        console.log(err);
      });
  }
  }

ngOnInit() {
 this.myForm = this._fb.group({
            products: this._fb.array([])
 })

 this.addProducts();

 let headers = new Headers();
	 headers.append('Authorization', 'Bearer d230d92c08d640eeb79b1350db1d7608');
		this.autocompleteItems = (text: string): Observable<Response> => {
			const url = 'https://api.api.ai/v1/entities?v=20150910';
			return this.http
			.get(url, {
				headers: headers
			})
			.map(data => { return this.extractTagNameFromJson(data); });
    };

}

initializeProducts() {
 	return this._fb.group({
			productName: ['', Validators.required],
			productDescription: ['', Validators.required],
			productURL: ['', Validators.required],
			productTag: ['', Validators.required]
		});
	}

    addProducts() {
        const control = <FormArray>this.myForm.controls['products'];
        const addrCtrl = this.initializeProducts();
        control.push(addrCtrl);
    }

    removeAddress(i: number) {
        const control = <FormArray>this.myForm.controls['products'];
        control.removeAt(i);
    }

submit() {
   console.log('Reactive Form submitted: ', this.myForm.value);

   firebase.database().ref('products'+'/'+this.name.uid).push().set(this.myForm.value).then(
        (success) => {
          console.log(success);
   // this.myForm ={};

      this.getFirebaseData(this.name.uid, this.user);
        this.router.navigate(['/pages/products']);
      }).catch(
        (err) => {
        console.log(err);
      });

}


}
