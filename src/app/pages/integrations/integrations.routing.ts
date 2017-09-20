import { Routes, RouterModule } from '@angular/router';

import { IntegrationsComponent } from './integrations.component';
import { MailChimpComponent } from './mailchimpauthorization.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
    children: [
      {
        path: 'mailchimp',
        component: MailChimpComponent,
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
