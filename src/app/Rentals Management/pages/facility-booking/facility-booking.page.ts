import { Component, OnInit, ViewChild } from "@angular/core";
import { FacilityBookingService } from "../../services/facility-booking.service";
import { RentalsUserService } from "../../services/rentals-user.service";
import { GeneralDropDownComponent } from "../../components/general-drop-down/general-drop-down.component";
import {
  AlertController,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  PopoverController
} from "@ionic/angular";
import { FacilityFilterComponent } from "../../modals/facility-filter/facility-filter.component";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { SortFilterComponent } from "../../modals/sort-filter/sort-filter.component";
import * as moment from 'moment';

@Component({
  selector: "app-facility-booking",
  templateUrl: "./facility-booking.page.html",
  styleUrls: ["./facility-booking.page.scss"],
})
export class FacilityBookingPage implements OnInit {
  constructor(
    private facilityBookingService: FacilityBookingService,
    private modalController: ModalController,
    private userService: RentalsUserService,
    private alertService: AlertServiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private popover: PopoverController,
  ) {
    this.selectedTab = "facilities";
  }
  items: any[] = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  bookingArray: any[] = [];
  selectedTab;
  loader = false;
  filterData: any = {
    facilityPage: 1,
    bookingPage: 1,
    limit: 10,
    searchTextFacility: "",
    searchTextBooking: "",
    searchBy:'Facility'
  };
  facilityDataFromFilterPage: any = {
    status: ["active"],
    projects: [],
    category: [],
    sort: ["-createdAt"],
  };
  bookingDataFromFilterPage: any = {
    searchBy:['Facility'],
    status: [],
    projects: [],
    sort: ["-startDate"],
    facility:[]
  };
  participants: any = ["Michael", "Solomon", "Davidson Jack", "Harley Spar", "Solomon", "Davidson Jack", "Harley Spar"];

  messageText: any = "";
  public noFacility = false;
  public noBooking = false;
  isSearching = false;

  private loadingInstance: HTMLIonLoadingElement;
  sortByValue;
  ngOnInit() {
    this.filterData.facilityPage = 1;
    this.filterData.bookingPage = 1;
    if (this.selectedTab === "facilities") this.viewFacilities("", "");
    this.noFacility = false;
    this.noBooking = false;

    this.sortByValue = window.localStorage.getItem('sortByValue');
    if( this.sortByValue == undefined || "" || this.sortByValue.length==0 ){
      window.localStorage.setItem('sortByValue','-startDate');
    }else{
      window.localStorage.setItem('sortByValue',this.sortByValue);
    }
    this.sortByValue = window.localStorage.getItem('sortByValue');
    this.bookingDataFromFilterPage.sort.splice(0,1, this.sortByValue)
  }

  async viewBookingHistory(event, purpose) {
    this.selectedTab = "bookingHistory";

    if (purpose === "search") {
      this.isSearching = true;
      this.loader = true;
      this.filterData.bookingPage = 1;
      this.bookingArray = [];
      this.noBooking = false;
      this.infiniteScroll.disabled=true;
    } else if (!event && !this.isSearching) {
      await this.presentLoading();
    }

    if (purpose === "view") {
      this.bookingArray = [];
      this.noBooking = false;
      this.filterData.bookingPage = 1;
      console.log(" this.filterData.bookingPage",this.bookingDataFromFilterPage.sort);
    }

    this.facilityBookingService
      .getBookingsHistory(this.filterData, this.bookingDataFromFilterPage)
      .subscribe(
        (data: any[]) => {
          this.bookingArray = this.bookingArray.concat(data["rows"]).map((item) => ({
            ...item,
            statusChangeVisible: false
          }));
          this.filterData.bookingPage += 1;
          this.noBooking = true;

          if (event) {
            event.target.complete();
          } else {
            this.loadingInstance.dismiss();
            this.loader = false;
          }

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
          this.loader = false;
          this.alertService.presentAlert(
            "",
            err.error.message ? err.error.message : "Something went wrong"
          );
        }
      );
  }

  async presentLoading() {
    this.loadingInstance = await this.loading.create({
      spinner: "lines",
    });
    await this.loadingInstance.present();
  }

  async viewFacilities(event, purpose) {
    if (purpose === "search") {
      this.isSearching = true;
      this.loader = true;
      this.filterData.facilityPage = 1;
      this.items = [];
      this.noFacility = false;
      this.infiniteScroll.disabled=true;
    } else if (!event && !this.isSearching) {
      await this.presentLoading();
    }

    if (purpose === "view") {
      this.items = [];
      this.noFacility = false;
      this.filterData.facilityPage = 1;
    }

    this.facilityBookingService
      .getFacilities(this.filterData, this.facilityDataFromFilterPage)
      .subscribe(
        (data: any[]) => {
          this.items = this.items.concat(data["rows"]);
          console.log(this.items);

          this.filterData.facilityPage += 1;
          this.noFacility = true;

          if (event) {
            event.target.complete();
          } else {
            this.loadingInstance.dismiss();
            this.loader = false;
          }

          if (
            this.filterData.facilityPage >
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
          this.loader = false;
          this.alertService.presentAlert(
            "",
            err.error.message ? err.error.message : "Something went wrong"
          );
        }
      );
  }

  openFilterModal() {
    this.modalController
      .create({
        component: FacilityFilterComponent,
        componentProps: {
          data: JSON.parse(JSON.stringify(this.facilityDataFromFilterPage)),
          bookingData: JSON.parse(
            JSON.stringify(this.bookingDataFromFilterPage)
          ),
          check: this.selectedTab,
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then(async (facilityFilter: any) => {
          // if searchBy value is there it will take or else Facility is default when close the facility filter
          if(this.selectedTab == 'bookingHistory'){
            this.filterData.searchBy = facilityFilter.data?facilityFilter.data.searchBy:"Facility"
          }
          this.filterData.searchTextBooking = ''
          if (facilityFilter.data) {
            console.log("DATA IS COMING");

            this.bookingArray = [];
            this.items = [];
            this.noFacility = false;
            this.noBooking = false;
            this.filterData.facilityPage = 1;
            this.filterData.bookingPage = 1;
            this.infiniteScroll.disabled = true;

            if (this.selectedTab === "facilities") {
              this.facilityDataFromFilterPage = Object.assign(
                {},
                facilityFilter.data
              );
              await this.viewFacilities("", "filter");
            } else {
                if(facilityFilter.data.startDate){
                facilityFilter.data.startDate = new Date(facilityFilter.data.startDate)
                facilityFilter.data.startDate = new Date(facilityFilter.data.startDate.setHours(0, 0, 0, 0));
                facilityFilter.data.startDate = facilityFilter.data.startDate.toJSON();
                facilityFilter.data.startDate = moment(facilityFilter.data.startDate).format('YYYY-MM-DD')
                facilityFilter.data.endDate   = moment(facilityFilter.data.startDate).format('YYYY-MM-DD')
                
              }
              this.bookingDataFromFilterPage = Object.assign(
                {},
                facilityFilter.data
              );
              await this.viewBookingHistory("", "filter");
            }
          }
          console.log(
            this.facilityDataFromFilterPage,
            "facility data from filter page"
          );
          console.log(
            this.bookingDataFromFilterPage,
            "booking data from filter page"
          );
        });

        return modal.present();
      });
  }

  openSortFilterModal(){
    this.popover.create({
      component: SortFilterComponent,
      componentProps: {
       bookingFilter : this.bookingDataFromFilterPage
      },
      event: event,
      // cssClass: 'custom-select-home',

    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then(data => {
        if (data.data === true) {
          this.viewBookingHistory('', 'view');
        }
      })
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return this.filterData.searchBy=='Facility'? true:false;
    }
    return this.filterData.searchBy=='ReferenceNumber'? true:false;
  }

  public alertFunction(data) {
    const alertObj: { header: string; message: string; buttons: Array<any> } = {
      header: "",
      message: "",
      buttons: [],
    };
    switch (data.status) {
      case "rejected":
        alertObj.header = "Change booking status";
        alertObj.message =
          "Click on APPROVE to change the booking status from Rejected to Approved.";
        alertObj.buttons = [
          {
            text: "APPROVE",
            handler: () => {
              this.changeStatus(data, {
                status: "approved",
              });
            },
          },
        ];
        break;
      case "approved":
        alertObj.header = "Change booking status";
        alertObj.message =
          "Click on REJECT to change the booking status from Approved to Rejected.";
        alertObj.buttons = [
          {
            text: "REJECT",
            handler: () => {
              this.changeStatus(data, {
                status: "rejected",
              });
            },
          },
        ];
        break;

      default:
        alertObj.header = "Change booking status";
        alertObj.message =
          "Click on APPROVE to change the booking status to Approved or REJECT to change the status to Rejected.";
        alertObj.buttons = [
          {
            text: "APPROVE",
            handler: () => {
              this.changeStatus(data, {
                status: "approved",
              });
            },
          },
          {
            text: "REJECT",
            handler: () => {
              this.changeStatus(data, {
                status: "rejected",
              });
            },
          },
        ];
        break;
    }

    this.alertController.create(alertObj).then((alert) => {
      alert.present();
    });
  }

  async changeStatus(facility, data: any) {
    await this.presentLoading();
    this.facilityBookingService.getChangeStatus(facility._id, data).subscribe(
      async (data: any) => {
        facility.status = data.status;
        facility.statusChangeVisible = false;
        this.loadingInstance.dismiss();
      },
      (err) => {
        this.loadingInstance.dismiss();
        this.presentAlert(err);
      }
    );
  }
  private presentAlert(err) {
    this.alertService.presentAlert(
      "",
      err.error.message
        ? err.error.message
        : "something went wrong please try again later"
    );
  }

  public onTabChange() {
    switch (this.selectedTab) {
      case 'bookingHistory':
        this.bookingArray = [];
        this.noBooking = false;
        this.viewBookingHistory('', 'view');
        break;

      default:
        this.items = [];
        this.noFacility = false;
        this.viewFacilities('', 'view');
        break;
    }
  }

  public showMoreInviteesDailog(ev: any, participants) {
    this.popover.create({
      component: GeneralDropDownComponent,
      cssClass: 'work-permit-custom-popover',
      event: ev,
      componentProps: {
        items: participants,
        
      }
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
          console.log("-----",data);
      })
    })
  }

  public showStatusChange(item) {
    item.statusChangeVisible = !item.statusChangeVisible;
  }
}
