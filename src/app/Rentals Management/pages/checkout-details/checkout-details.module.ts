import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { CheckoutDetailsPage } from './checkout-details.page';
import { AvatarModule } from 'ngx-avatar';

const routes: Routes = [
  {
    path: '',
    component: CheckoutDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    AvatarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckoutDetailsPage]
})
export class CheckoutDetailsPageModule {}
