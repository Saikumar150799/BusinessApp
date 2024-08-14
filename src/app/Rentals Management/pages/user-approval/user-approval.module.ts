import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserApprovalPage } from './user-approval.page';
import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';

const routes: Routes = [
  {
    path: '',
    component: UserApprovalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ApplicationPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ApprovalpopupComponent],
  declarations: [UserApprovalPage, ApprovalpopupComponent]
})
export class UserApprovalPageModule { }
