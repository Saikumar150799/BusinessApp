import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkPermitDetailsPage } from './work-permit-details.page';

const routes: Routes = [
  {
    path: '',
    component: WorkPermitDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkPermitDetailsPage]
})
export class WorkPermitDetailsPageModule {}
