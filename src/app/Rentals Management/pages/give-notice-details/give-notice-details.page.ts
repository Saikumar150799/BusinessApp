import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';

@Component({
  selector: 'app-give-notice-details',
  templateUrl: './give-notice-details.page.html',
  styleUrls: ['./give-notice-details.page.scss'],
})
export class GiveNoticeDetailsPage implements OnInit {
  public unitId: string = '';
  public unitData: any = {};
  public tenants: Array<any> = []
  public emptyTenants: boolean = false;
  public underNoticePayload: any = {
    tenantObj: []
  };
  public checkOutDate: any;
  public statusList: any = {
    cancelled: "Cancelled",
    shifting: "Shifting",
    shifted: "Shifted",
    not_ready: "Not ready",
    move_in_pending: "Move in pending",
    under_notice: "Under notice",
    occupied_by_tenant: "Occupied",
    vacant: "Vacant",
    unsold: "Unsold",
    moved_out : "Moved out",
    occupied_by_owner : "Occupied",
  };
  public OcuupancyStatusColor: Object = {
    "occupied_by_tenant": "badge-green",
    "occupied_by_owner" : "badge-green",
    "occupied": "badge-green",
    "move_in_pending": "badge-green",
    "shifted": "badge-green",
    "moved_out": "badge-red",
    "shifting": "badge-green",
    "under_notice": "badge-red",
    "cancelled": "badge-red"
  }
  constructor(
    public transService: translateService,
    public activatedRoute: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public checkInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService,
    public modalCtrl: ModalController,
    public router: Router
  ) { 
    this.activatedRoute.queryParamMap.subscribe(({params}: any) => {
      this.unitId = params.unitId ? params.unitId : '' ;
    });
  }

  ngOnInit() {
    this.getUnitDetailsByHome();
  }

  public async presentLoading(){
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return loading.present();
  }

  getUnitDetailsByHome(){
    this.presentLoading();
    this.checkInCheckOutService.getUnitDetails({unitId: this.unitId}).subscribe((data: any) =>{
      this.unitData = data;
      this.tenants = data.tenants || [];
      this.emptyTenants = this.tenants.length === 0 ? true : false;
      console.log(data);
      setTimeout(()=>{
        this.loadingCtrl.dismiss()
      },200)
    },(err)=>{
      console.log(err);
      setTimeout(()=>{
        this.loadingCtrl.dismiss()
      },200)
      this.alertService.presentAlert('', err.console.message || 'Something went wrong');
    })
  }

  dateChange(tenantData){
    // Checking if selected date for tenant
    const tenantPresent = this.underNoticePayload.tenantObj.some((tenant) => tenant && tenant.tenant === tenantData._id );
    if(!tenantPresent){
      this.underNoticePayload.tenantObj.push({tenant: tenantData._id, dateOfMoveOut:tenantData.checkOutDate})
    }else{
      // if already selected just updating the date of that tenant
      let tenantObj = this.underNoticePayload.tenantObj.find(tenant => tenant.tenant === tenantData._id);
      tenantObj.dateOfMoveOut = tenantData.checkOutDate
    }
  }

  underNotice(){
    this.presentLoading();
    this.checkInCheckOutService.giveNotice(this.unitId, this.underNoticePayload).subscribe((data: any)=>{
      console.log(data);
      setTimeout(()=>{
        this.loadingCtrl.dismiss();
        this.presentSuccessAlert();
        this.router.navigate(['/rentals-home']);
      },200)
    },(err)=>{
      console.log(err);
      setTimeout(()=>{
        this.loadingCtrl.dismiss()
      },200)
      this.alertService.presentAlert('', err.console.message || 'Something went wrong');
    })
  }

  handleOccupancyStatusColor(status){
    return this.OcuupancyStatusColor[status];
  }

  public async presentSuccessAlert(){
    const modal = await this.modalCtrl.create({
      component: SuccessAlertModalComponent,
      cssClass: 'success-alert-modal',
      componentProps: {
        data: {
          reference: 'CiCoChecklist',
          subHeader: 'A checkout notice has been raised.',
          door: this.unitData.listing.door,
          block: this.unitData.listing.block
        }
      }
    })
    modal.onDidDismiss().then((data=>{

    }))

    return modal.present();
  }
}
