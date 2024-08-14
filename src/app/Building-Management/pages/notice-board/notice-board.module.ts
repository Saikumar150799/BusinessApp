import { CreateNoticeComponent } from './../../modals/create-notice/create-notice.component';
import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';

import { IonicModule } from '@ionic/angular';

import { NoticeBoardPage } from './notice-board.page';

const routes: Routes = [
  {
    path: '',
    component: NoticeBoardPage
  }
];

@NgModule({
  entryComponents: [CreateNoticeComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvatarModule,
    ApplicationPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NoticeBoardPage]
})
export class NoticeBoardPageModule { }
