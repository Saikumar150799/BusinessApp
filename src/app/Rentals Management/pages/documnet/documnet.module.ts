import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { DocumnetPage } from './documnet.page';
import { ApplicationPageModule } from '../../ApplicationPageModule';

const routes: Routes = [
  {
    path: '',
    component: DocumnetPage
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
  declarations: [DocumnetPage]
})
export class DocumnetPageModule {}
