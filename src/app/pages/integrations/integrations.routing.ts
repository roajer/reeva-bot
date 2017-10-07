import { Routes, RouterModule } from '@angular/router';

import { IntegrationsComponent } from './integrations.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
