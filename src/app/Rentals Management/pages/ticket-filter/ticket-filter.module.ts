import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketFilterPage } from './ticket-filter.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TicketFilteProjectSearchComponent } from '../../modals/ticket-filte-project-search/ticket-filte-project-search.component';

const routes: Routes = [
  {
    path: '',
    component: TicketFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    BarcodeScanner
  ],
  declarations: [TicketFilterPage, TicketFilteProjectSearchComponent],
  entryComponents: [
    TicketFilteProjectSearchComponent
  ]
})
export class TicketFilterPageModule { }
