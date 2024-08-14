import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';

import { IonicModule } from '@ionic/angular';

import { NoticeDetailsPage } from './notice-details.page';

const routes: Routes = [
  {
    path: '',
    component: NoticeDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationPageModule,
    RouterModule.forChild(routes),
    AvatarModule
  ],
  declarations: [NoticeDetailsPage]
})
export class NoticeDetailsPageModule { }
