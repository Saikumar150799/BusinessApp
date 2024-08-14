import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GatepasDetailsPage } from './gatepas-details.page';

const routes: Routes = [
  {
    path: '',
    component: GatepasDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GatepasDetailsPage]
})
export class GatepasDetailsPageModule {}
