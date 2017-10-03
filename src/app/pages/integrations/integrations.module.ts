import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { userdata } from '../././_model/userdata';
import { IntegrationsComponent } from './integrations.component';
import { MailChimpComponent } from './mailchimpauthorization.component';
import { routing } from './integrations.routing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    NgaModule,
    routing,
  ],
  declarations: [
    IntegrationsComponent,
    MailChimpComponent
  ],
  providers: [
    NgbActiveModal
  ]
})
export class IntegrationsModule { }
