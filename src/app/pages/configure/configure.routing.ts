import { Routes, RouterModule } from '@angular/router';

import { ConfigureComponent } from './configure.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ConfigureComponent,
    children: [

    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
