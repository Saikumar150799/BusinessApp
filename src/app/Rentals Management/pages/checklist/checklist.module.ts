import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChecklistPage } from './checklist.page';
import { ApplicationPageModule } from '../../ApplicationPageModule';


const routes: Routes = [
  {
    path: '',
    component: ChecklistPage
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

  declarations: [ChecklistPage]
})
export class ChecklistPageModule {}
