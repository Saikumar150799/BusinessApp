import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketSubCategorySearchPage } from './ticket-sub-category-search.page';

const routes: Routes = [
  {
    path: '',
    component: TicketSubCategorySearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketSubCategorySearchPage]
})
export class TicketSubCategorySearchPageModule {}
