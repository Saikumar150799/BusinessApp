import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';
import { IonicModule } from '@ionic/angular';

import { CheckInDetailsPage } from './check-in-details.page';
import { ApplicationPageModule } from '../../ApplicationPageModule';
const routes: Routes = [
  {
    path: '',
    component: CheckInDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    IonicModule,
    RouterModule.forChild(routes),
    ApplicationPageModule,
  ],
  declarations: [CheckInDetailsPage]
})
export class CheckInDetailsPageModule {}
