import { ApplicationPageModule } from './../../ApplicationPageModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  entryComponents: [CreateNoticeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    BarcodeScanner
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
