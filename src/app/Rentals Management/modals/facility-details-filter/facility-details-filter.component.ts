import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { MainAppSetting } from "src/app/conatants/MainAppSetting";
import { FacilityBookingService } from "../../services/facility-booking.service";
@Component({
  selector: 'app-facility-details-filter',
  templateUrl: './facility-details-filter.component.html',
  styleUrls: ['./facility-details-filter.component.scss'],
})
export class FacilityDetailsFilterComponent implements OnInit {

  constructor(private modalController:ModalController,
    private navParams: NavParams,
    public appSetting: MainAppSetting,
    private facilityBookingService: FacilityBookingService) {
    if (this.navParams.get("sortData")) {
      this.bookingFilter = this.navParams.get("sortData");
    }
   }

  ngOnInit() {}
  bookingFilter: any = {
    status: [],
    projects: [],
    sort: ["-createdAt"],
  };
  
  
   
  
  selectBookingStatus(value) {
    if (this.bookingFilter.status.indexOf(value) === -1) {
      this.bookingFilter.status.splice(0, this.bookingFilter.status.length);
      this.bookingFilter.status.push(value);
    } else {
      this.bookingFilter.status.splice(0, this.bookingFilter.status.length);
    }
    console.log(this.bookingFilter.status);
  }
  public selectFilterSort(value) {
    
      this.bookingFilter.sort.splice(0, this.bookingFilter.sort.length);
      this.bookingFilter.sort.push(value);
      console.log(this.bookingFilter.sort, "SORT ARRAY");
    
  }

  public resetFilter(): void {
    {
      this.bookingFilter = {
        status: [],
        projects: [],
        sort: ["createdAt"],
      };
      
    }
  }
  async closeModal(sendData) {
     
      if (sendData) {
        console.log("Send data");
        await this.modalController.dismiss(this.bookingFilter);
      } else {
        console.log("Dont Send data");
        await this.modalController.dismiss();
      }
    
  }
}
