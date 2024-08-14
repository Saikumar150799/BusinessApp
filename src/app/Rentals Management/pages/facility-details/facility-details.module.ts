import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacilityDetailsPage } from './facility-details.page';
import { AvatarModule } from 'ngx-avatar';
import { FacilityDetailsFilterComponent } from "../../modals/facility-details-filter/facility-details-filter.component";
const routes: Routes = [
  {
    path: '',
    component: FacilityDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvatarModule,
    RouterModule.forChild(routes)
    
  ],
  declarations: [FacilityDetailsPage,
    FacilityDetailsFilterComponent],
    entryComponents:[FacilityDetailsFilterComponent]
})
export class FacilityDetailsPageModule {}
