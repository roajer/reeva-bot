import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { productsdata } from '../././_model/productsdata';
import { ProductsComponent } from './products.component';
import { routing } from './products.routing';
import { AppTranslationModule } from '../../app.translation.module';


import { TagInputModule } from 'ngx-chips';

import { SmartTablesService } from './smartTables/smartTables.service';


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
  ]
})
export class ProductsModule {}
