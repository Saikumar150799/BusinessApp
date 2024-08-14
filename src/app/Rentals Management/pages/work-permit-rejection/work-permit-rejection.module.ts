import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkPermitRejectionPage } from './work-permit-rejection.page';

const routes: Routes = [
  {
    path: '',
    component: WorkPermitRejectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkPermitRejectionPage]
})
export class WorkPermitRejectionPageModule {}
