import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { MainAppSetting } from "src/app/conatants/MainAppSetting";
import { FacilityBookingService } from "../../services/facility-booking.service";
import { PropertySearchComponent } from "../property-search/property-search.component";
import { FacilitySearchComponent } from "../facility-search/facility-search.component";
import { translateService } from "src/app/common-services/translate/translate-service.service";

@Component({
  selector: "app-facility-filter",
  templateUrl: "./facility-filter.component.html",
  styleUrls: ["./facility-filter.component.scss"],
})
export class FacilityFilterComponent implements OnInit {
  facilityFilter: any = {
    status: ["active"],
    projects: [],
    searchBy:'',
    category: [],
    sort: ["-createdAt"],
  };
  bookingFilter: any = {
    searchBy:[],
    status: [],
    projects: [],
    sort: ["-createdAt"],
    facility:[]
  };
  singleFacility;
  facilitiBookingName;
  filterData: any = {
    facilityPage: 1,
    bookingPage: 1,
    limit: 10,
    searchTextFacility: "",
    searchTextBooking: "",
    searchBy:'Facility'
  };
  bookingDataFromFilterPage: any = {
    searchBy:['Facility'],
    status: [],
    projects: [],
    sort: ["-createdAt"],
  };
  // bookingHistory;
  check: any = "";
  propertySearchValueForFacility: any;
  propertySearchValueForBooking: any;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public appSetting: MainAppSetting,
    private facilityBookingService: FacilityBookingService,
    public transService: translateService
  ) {
    if (this.navParams.get("data")) {
      this.facilityFilter = this.navParams.get("data");
    }
    if (this.navParams.get("bookingData")) {
      this.bookingFilter = this.navParams.get("bookingData");
    }
    if (this.navParams.get("check")) {
      this.check = this.navParams.get("check");
      console.log(this.check, "checkkkk");
    }

    if (this.facilityFilter.projects.length === 1) {
      this.propertySearchValueForFacility = "1 project selected";
    } else if (this.facilityFilter.projects.length === 0) {
      this.propertySearchValueForFacility === "";
    } else {
      this.propertySearchValueForFacility = `${this.facilityFilter.projects.length} projects selected`;
    }

    if (this.bookingFilter.projects.length === 1) {
      this.propertySearchValueForBooking = "1 project selected";
    } else if (this.bookingFilter.projects.length === 0) {
      this.propertySearchValueForBooking === "";
    } else {
      this.propertySearchValueForBooking = `${this.bookingFilter.projects.length} projects selected`;
    }
    this.facilitiBookingName=this.bookingFilter.singleFacility ? this.bookingFilter.singleFacility.name :""
    
    console.log(this.bookingFilter, "BOOKING FILTER CHECKKKKKKK");
  }

  ngOnInit() {}

  selectFilterStatus(value) {
    this.facilityFilter.status.splice(0, this.facilityFilter.status.length);
    this.facilityFilter.status.push(value);
    console.log(this.facilityFilter.status);
  }

  selectBookingStatus(value) {
    if (this.bookingFilter.status.indexOf(value) === -1) {
      this.bookingFilter.status.splice(0, this.bookingFilter.status.length);
      this.bookingFilter.status.push(value);
    } else {
      this.bookingFilter.status.splice(0, this.bookingFilter.status.length);
    }
    console.log(this.bookingFilter.status);
  }

  searchBy(value){
    this.bookingFilter.searchBy = [value]
    // to update refernceNumber in payload
    if(this.bookingFilter.searchBy=="ReferenceNumber"){
      this.bookingFilter.facility=[]
    }else{
      if(this.bookingFilter.singleFacility){
        this.bookingFilter.singleFacility = []
        this.facilitiBookingName = ""
      }
    }

  }

  selectFilterCategory(value) {
    if (this.facilityFilter.category.indexOf(value) === -1) {
      this.facilityFilter.category.splice(
        0,
        this.facilityFilter.category.length
      );
      this.facilityFilter.category.push(value);
      // console.log(this.facilityFilter.category);
    } else {
      this.facilityFilter.category.splice(
        0,
        this.facilityFilter.category.length
      );
    }
    console.log(this.facilityFilter.category);
  }

  openPropertyModal() {
    this.modalController
      .create({
        component: PropertySearchComponent,
        componentProps: {
          facilityPropertyData: JSON.parse(
            JSON.stringify(this.facilityFilter.projects)
          ),
          bookingPropertyData: JSON.parse(
            JSON.stringify(this.bookingFilter.projects)
          ),
          propertyCheck: this.check,
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then((propertyFilter: any) => {
          if (propertyFilter !== undefined && propertyFilter.data) {
            if (this.check === "facilities") {
              this.facilityFilter.projects = propertyFilter.data;
              if (this.facilityFilter.projects.length === 1)
                this.propertySearchValueForFacility = "1 project selected";
              else
                this.propertySearchValueForFacility = `${this.facilityFilter.projects.length} projects selected`;
            } else if (this.check === "bookingHistory") {
              this.bookingFilter.projects = propertyFilter.data;
              if (this.bookingFilter.projects.length === 1)
                this.propertySearchValueForBooking = "1 project selected";
              else
                this.propertySearchValueForBooking = `${this.bookingFilter.projects.length} projects selected`;
            }
          }
        });
        return modal.present();
      });

  }

  openFacilityModal(){
    this.modalController
    .create({
      component: FacilitySearchComponent,
      componentProps:{
        singleFacility: JSON.parse(
          JSON.stringify(this.bookingFilter.singleFacility?this.bookingFilter.singleFacility:"")
        ),
      }
    }).then((modal)=>{
      modal.onDidDismiss().then((data)=>{
        // to push only one facility id recently selected
        if( this.bookingFilter.facility.length<0 ){
          if(data.data.facility || data.data){
            this.bookingFilter.facility.push(data.data.facility._id);
          }else{
            this.bookingFilter.facility.push(data.data._id);
          }
        }else{
           this.bookingFilter.facility.pop();
           if(data.data.facility ){
            this.bookingFilter.facility.push(data.data.facility._id);
          }else{
            this.bookingFilter.facility.push(data.data._id);
          }

        }
       
        if(data.data){
          if(data.data.facility){
          this.singleFacility = data.data.facility
          this.facilitiBookingName = this.singleFacility.name
          this.bookingFilter.singleFacility= this.singleFacility 
          }else{
            this.singleFacility = data.data
            this.facilitiBookingName = this.singleFacility.name
            this.bookingFilter.singleFacility= this.singleFacility 
          }
        }
        else{
          this.facilitiBookingName=''
          this.bookingFilter.facility=[]
          this.bookingFilter.singleFacility=[]
        }
        
      })
      return modal.present();
    })
  }

  async closeModal(sendData) {
    if (this.check === "facilities") {
      if (sendData) {
        console.log("Send data");
        await this.modalController.dismiss(this.facilityFilter);
      } else {
        console.log("Dont Send data");
        await this.modalController.dismiss();
      }
    } else {
      if (sendData) {
        console.log("Send data");
        await this.modalController.dismiss(this.bookingFilter);
      } else {
        console.log("Dont Send data");
        await this.modalController.dismiss();
      }
    }
  }

  public resetFilter(): void {
    if (this.check === "facilities") {
      this.facilityFilter = {
        status: ["active"],
        category: [],
        projects: [],
        sort: ["createdAt"],
      };
      this.propertySearchValueForFacility = "";
    } else {
      this.bookingFilter = {
        status: [],
        projects: [],
        searchBy:['Facility'],
        sort: this.bookingFilter.sort,
      };
      this.propertySearchValueForBooking = "";
      this.facilitiBookingName=''
      this.bookingFilter.facility=[]
      this.bookingFilter.singleFacility=[]
    }
  }

  public removeData(event: Event) {
    this.facilitiBookingName=''
    event.preventDefault();
    event.stopPropagation();

    if (this.check === "facilities") {
      this.facilityFilter.projects = [];
      this.propertySearchValueForFacility = "";
    } else {
      this.bookingFilter.projects = [];
      this.propertySearchValueForBooking = "";
      this.bookingFilter.facility=[]
      this.bookingFilter.singleFacility=[]
    }
  }

  public selectFilterSort(value) {
    // if (this.check === "facilities") {
    //   this.facilityFilter.sort.splice(0, this.facilityFilter.sort.length);
    //   this.facilityFilter.sort.push(value);

    //   console.log(this.facilityFilter.sort, "SORT ARRAY");
    // } else {
      this.bookingFilter.sort.splice(0, this.bookingFilter.sort.length);
      this.bookingFilter.sort.push(value);
      console.log(this.bookingFilter.sort, "SORT ARRAY");
    // }
  }
}
