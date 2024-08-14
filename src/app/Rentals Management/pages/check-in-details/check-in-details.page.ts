import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, ModalController } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { CheckInCheckOutService } from "../../services/ci-co/check-in-check-out.service";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { DataService } from "../../services/data/data.service";
import { ViewPhotoComponent } from "../../components/view-photo/view-photo.component";

@Component({
  selector: "app-check-in-details",
  templateUrl: "./check-in-details.page.html",
  styleUrls: ["./check-in-details.page.scss"],
})
export class CheckInDetailsPage implements OnInit {
  public unitId: string;
  private loadingInstence: HTMLIonLoadingElement;
  public unitData: any = {};
  public tenants: Array<any> = [];
  public emptyTenants: boolean = false;
  public checkinPayload: any = {};
  public type: string = "";
  public payload: any = {};

  constructor(
    public transService: translateService,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public CheckInCheckoutService: CheckInCheckOutService,
    public alertService: AlertServiceService,
    public modalController: ModalController,
    public router: Router,
    public dataService: DataService
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      params.params.unitId ? (this.unitId = params.params.unitId) : "";
      params.params.type ? (this.type = params.params.type) : "";
      this.payload.unitId = params.params.unitId;
    });
  }

  ngOnInit() {
    this.getUnitDetails(this.payload);
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  public async getUnitDetails(payload) {
    if (this.type === "re-confirm") {
      this.payload.showRejectedItems = `&showRejectedItems=true`;
    }
    await this.presentLoading();
    this.CheckInCheckoutService.getUnitDetails(payload).subscribe(
      (data: any) => {
        this.loadingCtrl.dismiss();
        this.unitData = data;
        this.tenants = data.tenants;

        this.emptyTenants = data.tenants.length > 0 ? false : true;
        console.log("DETAILS", data);
      },
      (err) => {
        this.loadingCtrl.dismiss();
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  checkAppPermissions(){
    return this.unitData.appPermission && 
    this.unitData.appPermission.checkIn && 
    this.unitData.appPermission.checkIn.businessApp === true &&
    this.unitData.isCheckInAllowed
  }

  async uploadDocument() {
    if(this.checkAppPermissions()){
      this.dataService.setData(this.unitData);
      this.checkinPayload.home = this.unitData._id;
      this.checkinPayload.appPermission = this.unitData.appPermission && this.unitData.appPermission.checkIn.businessApp ? this.unitData.appPermission.checkIn.businessApp : false;
      this.checkinPayload.isCheckInAllowed = this.unitData.isCheckInAllowed ? this.unitData.isCheckInAllowed : false;
      this.checkinPayload.door = this.unitData.listing && this.unitData.listing.door;
      this.checkinPayload.block = this.unitData.listing && this.unitData.listing.block;
      
      this.router.navigate(['/rentals-documnet'], { queryParams: { data: JSON.stringify(this.checkinPayload) } });
    }else{
      this.alertService.presentAlert('','Check-in has been disabled for your account; kindly reach out to the administrator for assistance.');
    }
  }

  routeToCheckinForm() {
    if(this.checkAppPermissions()){
      this.router.navigate(["/rentals-checkin-in-form"], {
        queryParams: { 
          type: this.type, 
          home: this.unitId,
         },
      });
    }else{
      this.alertService.presentAlert('','Re-Confirm has been disabled for your account; kindly reach out to the administrator for assistance.');
    }
  }

  async viewPhoto(images){
    const modal = await this.modalController.create({
      component : ViewPhotoComponent,
      componentProps: {
        images: images
      }
    });

    modal.onDidDismiss().then((data: any)=>{
      console.log(data);
    })

    return modal.present();
  }
}
