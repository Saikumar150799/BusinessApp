import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GiveNoticeDetailsPage } from './give-notice-details.page';
import { AvatarModule } from 'ngx-avatar';

const routes: Routes = [
  {
    path: '',
    component: GiveNoticeDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvatarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GiveNoticeDetailsPage]
})
export class GiveNoticeDetailsPageModule {}
