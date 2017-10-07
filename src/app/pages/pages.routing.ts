import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from '.././_service/auth.service';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },


{ path: 'upgrade', loadChildren: './upgrade/upgrade.module#UpgradeModule', canActivate: [AuthGuard] },
{ path: 'products', loadChildren: './products/products.module#ProductsModule', canActivate: [AuthGuard] },
{ path: 'configure', loadChildren: './configure/configure.module#ConfigureModule', canActivate: [AuthGuard] },
{ path: 'integration', loadChildren: './integrations/integrations.module#IntegrationsModule', canActivate: [AuthGuard] },
{ path: 'optin', loadChildren: './optin/optin.module#OptinModule', canActivate: [AuthGuard] },


    ], canActivate: [ AuthGuard ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
