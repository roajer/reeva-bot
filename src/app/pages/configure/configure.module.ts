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

const gapiClientConfig: ClientConfig = {
  clientId: '251188364704-v9eajm5hjh3fgrmjp7i964t7076d4ujl.apps.googleusercontent.com',
    discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
    scope: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/analytics',
    ].join(' '),
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig,
          }),
  ],
  declarations: [
    ConfigureComponent,
  ],
  providers: [
    userdata,
    UploadService,
  ],
})
export class ConfigureModule {}
