import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { FacilityBookingPage } from "./facility-booking.page";
import { FacilityFilterComponent } from "../../modals/facility-filter/facility-filter.component";
import { PropertySearchComponent } from "../../modals/property-search/property-search.component";
import { FacilitySearchComponent } from "../../modals/facility-search/facility-search.component";

const routes: Routes = [
  {
    path: "",
    component: FacilityBookingPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    FacilityBookingPage,
    FacilityFilterComponent,
    PropertySearchComponent,
    FacilitySearchComponent,
  ],
  entryComponents: [FacilityFilterComponent, PropertySearchComponent,FacilitySearchComponent],
})
export class FacilityBookingPageModule {}
