import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { StorageService } from 'src/app/common-services/storage-service.service';
import { FacilityBookingService } from '../../services/facility-booking.service';
import { RentalsUserService } from '../../services/rentals-user.service';
import { FacilityDetailsFilterComponent } from "../../modals/facility-details-filter/facility-details-filter.component";
import { GeneralDropDownComponent } from "../../components/general-drop-down/general-drop-down.component";

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.page.html',
  styleUrls: ['./facility-details.page.scss'],
})
export class FacilityDetailsPage implements OnInit {
  public currencyCode = window.localStorage.getItem('currencyCode');
  public selectedSegment;
  public FacilityData: any = {
    uid: "",
  };
  public ProjectData: any = {
    uid: "",
  };
  public BookingData: any = [];
  sortBookingDetails: any = {

    sort: ["-createdAt"],
  };
  public data: any = {};
  private loadingInstence: HTMLIonLoadingElement;
  public facilityId: string;
  bookingDataFromFilterPage: any = {
    status: [],
    projects: [],
    sort: ["-createdAt"],
  };

  constructor(
    private route: ActivatedRoute,
    private _facility: FacilityBookingService,
    private userService: RentalsUserService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public alertService: AlertServiceService,
    private modalController: ModalController,
    private popover: PopoverController,
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      params.params.facilityId ?
        (this.facilityId = params.params.facilityId) : "";

      this.selectedSegment = "FACILITY";

      this.getFacilityDetails();


    });
  }


  ngOnInit() { }

  public alertFunction(data) {
    const alertObj: { header: string, message: string, buttons: Array<any> } = {
      header: '',
      message: '',
      buttons: []
    }
    switch (data.status) {
      case 'rejected':
        alertObj.header = 'Change booking status';
        alertObj.message = 'Click on APPROVE to change the booking status from Rejected to Approved.';
        alertObj.buttons = [{
          text: 'APPROVE',
          handler: () => {
            this.changeStatus(data, {
              "status": "approved"
            });
          }
        }]
        break;
      case 'approved':
        alertObj.header = 'Change booking status';
        alertObj.message = 'Click on REJECT to change the booking status from Approved to Rejected.';
        alertObj.buttons = [{
          text: 'REJECT',
          handler: () => {
            this.changeStatus(data, {
              "status": "rejected"
            });
          }
        }]
        break;

      default:
        alertObj.header = 'Change booking status';
        alertObj.message = 'Click on APPROVE to change the booking status to Approved or REJECT to change the status to Rejected.';
        alertObj.buttons = [{
          text: 'APPROVE',
          handler: () => {
            this.changeStatus(data, {
              "status": "approved"
            });
          }
        },
        {
          text: 'REJECT',
          handler: () => {
            this.changeStatus(data, {
              "status": "rejected"
            });
          }
        }]
        break;
    }

    this.alertController.create(alertObj).then(alert => {
      alert.present();
    });
  }

  async changeStatus(facility, data: any) {
    await this.presentLoading();
    this._facility.getChangeStatus(facility._id, data).subscribe(
      async (data: any) => {
        facility.status = data.status
        facility.statusChangeVisible = false;
        this.loadingInstence.dismiss();
      },
      (err) => {
        this.loadingInstence.dismiss();
        this.presentAlert(err);
      }
    )
  }
  public propertyNames;
  public async getFacilityDetails() {

    await this.presentLoading();
    this._facility.getFacilityById(this.facilityId).subscribe(
      (data: any) => {
        this.FacilityData = data;
        this.getProfile();
        this.propertyNames = Object.entries(this.FacilityData.bookingInfo.weekDays);
        console.log(this.propertyNames);
      },
      async (err) => {
        this.loadingInstence.dismiss();
        this.presentAlert(err);
      }
    )
  }

  public getProjectDetails() {
    this._facility.getProject(this.FacilityData.project._id).subscribe(
      async (data: any) => {
        this.loadingInstence.dismiss();
        this.ProjectData = data;
      },
      async (err) => {
        this.presentAlert(err);
      }
    )
  }


  public async getBookingDetails() {
    await this.presentLoading();
    this._facility.getBookingDetails(this.facilityId, this.bookingDataFromFilterPage).subscribe(
      (data: any) => {
        this.loadingInstence.dismiss();
        this.BookingData = data.rows.map((item) => ({
          ...item,
          statusChangeVisible: false
        }));;
      },
      (err) => {
        this.loadingInstence.dismiss();
        this.presentAlert(err);
      }
    )
  }

  async getProfile() {
    this.userService.getUserById(this.FacilityData.custodian._id).subscribe(async (data: any) => {
      this.data = data;
      this.getProjectDetails();

    }, error => {

      this.loadingInstence.dismiss();
      this.presentAlert(error);
    });
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }

  private presentAlert(err) {
    this.alertService.presentAlert('', err.error.message ? err.error.message : "something went wrong please try again later")
  }
  async openFilterModal1() {
    console.log("1");
    await this.modalController
      .create({
        component: FacilityDetailsFilterComponent,
        componentProps: {
          sortData: JSON.parse(JSON.stringify(this.bookingDataFromFilterPage)),

          //check: this.selectedTab,
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then(async (facilityFilter: any) => {
          if (facilityFilter.data) {
            console.log("DATA IS COMING");
            console.log(facilityFilter.data)
            this.BookingData = [];
            {
              this.bookingDataFromFilterPage = Object.assign(
                {},
                facilityFilter.data
              );


              await this.getBookingDetails();
            }
          }
        });

        return modal.present();
      });

  }


  public onTabChange() {
    switch (this.selectedSegment) {
      case 'BOOKING':
        this.BookingData = [];
        this.getBookingDetails();
        break;

      default:
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
      })
    })
  }

  public showStatusChange(item) {
    item.statusChangeVisible = !item.statusChangeVisible;
  }

}
