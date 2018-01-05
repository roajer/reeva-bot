import { Routes, RouterModule } from '@angular/router';

import { Login } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
