import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { userdata } from '../././_model/userdata';
import { UpgradeComponent } from './upgrade.component';
import { routing } from './upgrade.routing';
import { PaymentService } from './payment.service';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    UpgradeComponent
  ],
  providers: [
    userdata,
    PaymentService,
  ]
})
export class UpgradeModule {}
