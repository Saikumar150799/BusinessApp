import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalController, NavParams, IonInfiniteScroll } from "@ionic/angular";
import { FacilityBookingService } from '../../services/facility-booking.service';
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { FacilityFilterComponent } from '../facility-filter/facility-filter.component';


@Component({
  selector: 'app-facility-search',
  templateUrl: './facility-search.component.html',
  styleUrls: ['./facility-search.component.scss'],
})
export class FacilitySearchComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  loading = false;
  facilityBooking:any=[];
  singleFacility:any;
  existingIdInSelectedSingleFacility:any;
  facilityId:any;
  filterData: any = {
    facilityPage: 1,
    bookingPage: 1,
    limit: 15,
    searchTextBooking: "",
    searchBy:'Facility'
  };
  loader = false;
  bookingDataFromFilterPage: any = {
    searchBy:['Facility'],
    status: [],
    projects: [],
    sort: ["-createdAt"],
  };
  selectSingleFacility=[]
  constructor(
    private modalController: ModalController,
    private facilityBookingService: FacilityBookingService,
    private alertService: AlertServiceService,
    private navParams: NavParams,
  ) { 
    if (this.navParams.get("singleFacility")) {
      this.singleFacility = this.navParams.get("singleFacility");
      this.selectSingleFacility.push(this.singleFacility._id);
    }

    
  }
  private loadingInstance: HTMLIonLoadingElement;
  alreadyExistSingalFacility:any
  // final:any
  ngOnInit() {
    this.viewFacilities("")
  }
  viewFacilities(event){
    if (!event) {
      this.loading = true;
    }
    this.facilityBookingService.getBookings(this.filterData,this.bookingDataFromFilterPage).subscribe((data)=>{
      this.facilityBooking = data["rows"];

      try {
        event ? event.target.complete() : (this.loading = false);
      } catch (error) {

      }

      const facility = this.facilityBooking.find(facility => facility.facility._id == this.selectSingleFacility[0] );
      this.alreadyExistSingalFacility = facility

      if(facility!=undefined) {
        if(facility.facility._id){
          this.facilityId = facility._id
        }
      }
      console.log(this.facilityBooking, "get facilityBooking",this.facilityId);
    },
    (err) => {
      this.loading = false;
    }
    )
  }

  selectFacility(facility){
  
    this.facilityId=""
    if(this.selectSingleFacility.length<0 ){
      this.selectSingleFacility.push(facility._id);
    }else{
      this.existingIdInSelectedSingleFacility =  this.selectSingleFacility[0]
      this.selectSingleFacility.pop();
      this.selectSingleFacility.push(facility._id);

    }

    if(this.selectSingleFacility.includes(facility._id)){
      this.singleFacility = facility
    }else{
      this.singleFacility = ''
    }
    
    if(this.selectSingleFacility[0]==this.existingIdInSelectedSingleFacility ||this.singleFacility.facility._id==this.existingIdInSelectedSingleFacility){
      this.selectSingleFacility = []
      this.singleFacility=''
    }
 console.log("================================",this.singleFacility);
   
  }

  closeModal(sendData) {
      if (sendData) {
        console.log("Send data");
        this.modalController.dismiss(this.singleFacility);
      } else {
        console.log(" Send data");

        this.modalController.dismiss(this.alreadyExistSingalFacility);    
    }
  }


  loadMoreFacilities(event){
    if (this.filterData.bookingPage === 1) this.filterData.bookingPage += 1;

    this.facilityBookingService.getBookings(this.filterData,this.bookingDataFromFilterPage).subscribe(
      (data: any[]) => {
        this.facilityBooking = this.facilityBooking.concat(data["rows"]);
        this.filterData.bookingPage += 1;

        event ? event.target.complete() : this.loadingInstance.dismiss();

        if (
          this.filterData.bookingPage >
          Math.ceil(data["count"] / this.filterData.limit)
        ) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
      (err) => {
        console.log(err);
        this.loadingInstance.dismiss();
      }
    );

  }

}
