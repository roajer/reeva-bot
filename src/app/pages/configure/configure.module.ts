import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { userdata } from '../././_model/userdata';
import { ConfigureComponent } from './configure.component';
import { routing } from './configure.routing';
import { ClientConfig, GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';
import { UploadService } from './upload.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,

  ],
  declarations: [
    ConfigureComponent,
  ],
  providers: [
    userdata,
    UploadService,
    NgbActiveModal
  ],
})
export class ConfigureModule {}
