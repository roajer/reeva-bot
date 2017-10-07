import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { optindata } from '../././_model/optindata';
import { OptinComponent } from './optin.component';
import { routing } from './optin.routing';
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
    OptinComponent,
  ],
  providers: [
    optindata,
    NgbActiveModal
  ]
})
export class OptinModule {}
