import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketsPage } from './tickets.page';
import { TicketComponent } from '../../components/ticket/ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketsPage
  }
];

@NgModule({
  entryComponents: [TicketComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TicketsPage, TicketComponent]
})
export class TicketsPageModule { }
