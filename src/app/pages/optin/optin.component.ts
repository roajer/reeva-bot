import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { optindata } from '../././_model/optindata';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'optin',
  templateUrl: './optin.component.html',
  styleUrls: ['./optin.component.scss']
})
export class OptinComponent implements OnInit {

  myForm = new FormGroup({
  	optinURL: new FormControl('',  Validators.pattern('^[a-zA-Z]+$'))
});

autocompleteItems: any;
modalRef : any;
 currentOptin : string ="";
 query: string = '';
 updates : any = {};
 updateInfo =[];
 formdata: any ={};
 name: any;
 loader: boolean;
 arrayOptin : any = [];
 formB: FormGroup;

 constructor(public user: optindata, public af: AngularFireAuth, private router: Router,
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
    const control1 = <FormArray>this.myForm.controls['optin'];
    const addrCtrl =  this.formB;
    let i =0;
     this.loader = true;
       firebase.database().ref('optin'+'/'+data).once('value').then(function(snapshot) {
          snapshot.forEach(function(child){
          var key = child.key;
          var value = child.val();
          if(value && value!= undefined){
            value.key = key;
            arrayP.push(value);
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
        optinName: ['', Validators.required],
        optinDescription: ['', Validators.required],
        optinURL: ['', Validators.required],
        optinTag: ['', Validators.required],
        key :['']
      });
         this.formB.setValue(elem);
         control1.push(this.formB);
        }
      })
      }
    else {
         this.addOptin();

    }
      this.loader = false;
     this.formdata = user;

    });
   }

    onSubmit(formData) {

      if(formData.valid)
     {

      firebase.database().ref('optin'+'/'+this.name.uid).push().set(formData.value).then(
          (success) => {
          this.getFirebaseData(this.name.uid, this.user);
          this.router.navigate(['/pages/optin']);
        }).catch(
          (err) => {
          console.log(err);
        });
    }
    }

ngOnInit() {
 this.myForm = this._fb.group({
            optin: this._fb.array([])
 })


 let headers = new Headers();
		headers.append('Authorization', 'Bearer d230d92c08d640eeb79b1350db1d7608');
		this.autocompleteItems = (text: string): Observable<Response> => {

			const url = 'https://us-central1-reeva-d9399.cloudfunctions.net/getMailList?userid='+this.name.uid;
			return this.http
			.get(url, {
				headers: headers
			})
			.map(data => { return this.extractTagNameFromJson(data); });
    };

}

initializeOptin() {
  let uripattern ="/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i";
 	return this._fb.group({
			optinName: ['', Validators.required],
			optinDescription: ['', Validators.required],
			optinURL: ['', Validators.required],
			optinTag: ['', Validators.required]
		});
	}

    addOptin() {
        const control = <FormArray>this.myForm.controls['optin'];
        const addrCtrl = this.initializeOptin();
        control.push(addrCtrl);
    }

    removeAddress(i: number) {
        const control = <FormArray>this.myForm.controls['optin'];
        this.currentOptin = control.value[i].key;
        control.removeAt(i);
        firebase.database().ref('optin'+'/'+this.name.uid +'/'+this.currentOptin).remove().then((snap) => {
        this.getFirebaseData(this.name.uid, this.user);
         this.openModal('Removed the Optin','success-modal');
        this.router.navigate(['/pages/optin']);
         }).catch(
         (err) => {
         console.log(err);
       });
     }

submit(i:number) {
   if(this.myForm.valid)
   {
     let optin : any = {};
     optin.optin =[];
     this.updates ={};
     const control = <FormArray>this.myForm.controls['optin'];
         if(i != undefined)
        this.currentOptin = control.value[i].key;
  if(this.currentOptin == undefined || (this.currentOptin !=undefined && this.currentOptin.length == 0) )
    {

      optin.optin.push(control.value[i]);
      firebase.database().ref('optin'+'/'+this.name.uid).push(control.value[i]).then((snap) => {
      }).then(sucess => {

        this.getFirebaseData(this.name.uid, this.user);
        this.router.navigate(['/pages/optin']);
         this.openModal('Created new Optin','success-modal');

      });
   }
    else
      {
        optin.optin.push(control.value[i]);
         firebase.database().ref('optin'+'/'+this.name.uid +'/'+this.currentOptin).update(control.value[i]).then((snap) => {
         this.getFirebaseData(this.name.uid, this.user);
         this.router.navigate(['/pages/optin']);
         this.openModal('Updated current Optin','success-modal');
      }).catch(
        (err) => {
        console.log(err);
      });

      }
  }
   console.log('Reactive Form submitted: ', this.myForm.value);
}


}
