import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GatepassPage } from './gatepass.page';
import { ApplicationPageModule } from '../../ApplicationPageModule';

const routes: Routes = [
  {
    path: '',
    component: GatepassPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ApplicationPageModule
  ],
  declarations: [GatepassPage]
})
export class GatepassPageModule {}
