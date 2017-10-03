import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { productsdata } from '../././_model/productsdata';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';



@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {

myForm = new FormGroup({
  	productURL: new FormControl('',  Validators.pattern('^[a-zA-Z]+$'))
});

autocompleteItems: any;
 modalRef : any;
  currentProd : string ="";
  query: string = '';
  updates : any = {};
  updateInfo =[];
  formdata: any ={};
  name: any;
  loader: boolean;
  arrayProd : any = [];
  formB: FormGroup;


// In one of your component ts file

 constructor(public user: productsdata, public af: AngularFireAuth, private router: Router,
     private _fb: FormBuilder, private http: Http, private modalService: NgbModal) {

     this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth;
      this.loader = true;
      this.getFirebaseData(this.name.uid, user);
      }
     });
   }

 openModal(content,cssClass) {
  this.modalRef = this.modalService.open(content , { windowClass:cssClass });
   setTimeout(() => { this.modalRef.close()
   },1500);


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
  let arrayP = [];
  const control1 = <FormArray>this.myForm.controls['products'];
  const addrCtrl =  this.formB;
  let i =0;
   this.loader = true;
     firebase.database().ref('products'+'/'+data).once('value').then(function(snapshot) {
        snapshot.forEach(function(child){
        var key = child.key;
        var value = child.val();
        if(value.products != undefined &&  value.products[0] != undefined){
          value.products[0].key = key;
          arrayP.push(value.products[0]);
        }
       })
      }).then(sucess => {
      control1.controls = [];
      if(arrayP.length > 0)
        {
      arrayP.forEach(elem =>{
      if(elem != null)
        {
      this.formB = this._fb.group({
			productName: ['', Validators.required],
			productDescription: ['', Validators.required],
			productURL: ['', Validators.required],
      productTag: ['', Validators.required],
      key :['']
    });
       this.formB.setValue(elem);
       control1.push(this.formB);
      }
    })
    }
  else {
       this.addProducts();

  }
    this.loader = false;
   this.formdata = user;

  });
 }

  onSubmit(formData) {

    if(formData.valid)
   {

    firebase.database().ref('products'+'/'+this.name.uid).push().set(formData.value).then(
        (success) => {
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

//this.addProducts();

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
  let uripattern ="/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i";
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
        this.currentProd = control.value[i].key;
        control.removeAt(i);
        firebase.database().ref('products'+'/'+this.name.uid +'/'+this.currentProd).remove().then((snap) => {
        this.getFirebaseData(this.name.uid, this.user);
         this.openModal('Removed the product','success-modal');
        this.router.navigate(['/pages/products']);
         }).catch(
         (err) => {
         console.log(err);
       });
     }

submit(i:number) {
   if(this.myForm.valid)
   {
     let product : any = {};
     product.products =[];
     this.updates ={};
     const control = <FormArray>this.myForm.controls['products'];
         if(i != undefined)
        this.currentProd = control.value[i].key;
  if(this.currentProd == undefined || (this.currentProd !=undefined && this.currentProd.length == 0) )
    {

      product.products.push(control.value[i]);
      firebase.database().ref('products'+'/'+this.name.uid).push(product).then((snap) => {
      }).then(sucess => {

        this.getFirebaseData(this.name.uid, this.user);
        this.router.navigate(['/pages/products']);
         this.openModal('Created new product','success-modal');
      }).catch(
        (err) => {
        console.log(err);
      });
   }
    else
      {
        product.products.push(control.value[i]);
         firebase.database().ref('products'+'/'+this.name.uid +'/'+this.currentProd).update(product).then((snap) => {
         this.getFirebaseData(this.name.uid, this.user);
         this.router.navigate(['/pages/products']);
         this.openModal('Updated current product','success-modal');
      }).catch(
        (err) => {
        console.log(err);
      });

      }
  }
   console.log('Reactive Form submitted: ', this.myForm.value);
}


}
