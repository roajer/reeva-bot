import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { productsdata } from '../././_model/productsdata';
import { ProductsComponent } from './products.component';
import { routing } from './products.routing';
import { AppTranslationModule } from '../../app.translation.module';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { TagInputModule } from 'ngx-chips';




@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
   TagInputModule,
  ],
  declarations: [
    ProductsComponent,
  ],
  providers: [
    productsdata,
    NgbActiveModal
  ]
})
export class ProductsModule {}
