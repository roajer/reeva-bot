import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { productsdata } from '../././_model/productsdata';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';



@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {

myForm = new FormGroup({
 productURL: new FormControl('', Validators.pattern('^[a-zA-Z]+$'))
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
  this.modalRef = this.modalService.open(content , { windowClass: cssClass });
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
   this.loader = true;
     firebase.database().ref('products'+'/'+data).once('value').then(function(snapshot) {
       user = snapshot.val();
       console.log(user);
  }).then(sucess => {
    this.loader = false;

  });
 }


 // save(model: productsdata) {
        // call API to save customer
   //     console.log(model);
  //  }

  onSubmit(formData) {

    if(formData.valid)
   {
     console.log(formData);

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
    return this.http.get(url, {
        headers: headers
      }).map(data => { return this.extractTagNameFromJson(data); });
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
        control.removeAt(i);
        firebase.database().ref('products'+'/'+this.name.uid +'/'+this.currentProd).update(this.myForm.value).then((snap) => {
        this.getFirebaseData(this.name.uid, this.user);
         this.openModal('Removed the product','success-modal');
        this.router.navigate(['/pages/products']);
         }).catch(
         (err) => {
         console.log(err);
       });
     }

submit() {
   if(this.myForm.valid)
   {
     this.updates ={};

  if(!(this.currentProd.length > 0))
    {
     firebase.database().ref('products'+'/'+this.name.uid).push(this.myForm.value).then(  (snap) => {
     const key = snap.key
     this.currentProd = key;
     this.getFirebaseData(this.name.uid, this.user);
      this.openModal('Added new product','success-modal');
        this.router.navigate(['/pages/products']);
      }).catch(
        (err) => {
        console.log(err);
      });
   }
    else
      {
         firebase.database().ref('products'+'/'+this.name.uid +'/'+this.currentProd).update(this.myForm.value).then((snap) => {
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
