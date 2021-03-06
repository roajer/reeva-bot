import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { userdata } from '../././_model/userdata';
import { IntegrationsComponent } from './integrations.component';
import { routing } from './integrations.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
  ],
  declarations: [
    IntegrationsComponent,
  ],
})
export class IntegrationsModule { }
