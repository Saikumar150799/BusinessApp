import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyDataProjectPage } from './my-data-project.page';
import { MyDataProjectFilterComponent } from '../../components/my-data-project-filter/my-data-project-filter.component';

const routes: Routes = [
  {
    path: '',
    component: MyDataProjectPage
  }
];

@NgModule({
  entryComponents: [MyDataProjectFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyDataProjectPage, MyDataProjectFilterComponent]
})
export class MyDataProjectPageModule { }
