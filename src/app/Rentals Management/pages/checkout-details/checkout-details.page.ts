import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.page.html',
  styleUrls: ['./checkout-details.page.scss'],
})
export class CheckoutDetailsPage implements OnInit {
  public unitId: string = '';
  public unitData: any = {};
  public tenants: Array<any> = [];
  public emptyTenants: boolean = false;
  public type: string = "";
  public emptyForm: boolean = false ;
  public tenant: string = '';
  constructor(
    public transService: translateService,
    public loadingCtrl: LoadingController,
    public checkInCheckOutService: CheckInCheckOutService,
    public activatedRoute: ActivatedRoute,
    public alertService: AlertServiceService,
    public router: Router
  ) { 
    this.activatedRoute.queryParamMap.subscribe(({params}: any) => {
      this.unitId = params.unitId ? params.unitId : '' ;
      this.type = params.type? params.type : '' ;
      this.getUnitDetailsByHome();
    });
  }
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
    occupied_by_tenant: "badge-green",
    occupied_by_owner : "badge-green",
    occupied: "badge-green",
    move_in_pending: "badge-green",
    shifted: "badge-green",
    moved_out: "badge-red",
    under_notice: "badge-red",
    shifting: "badge-green",
    cancelled: "badge-red"
  }

  ngOnInit() {  
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
      this.emptyForm = data.checklist.items.length === 0 ? true : false ;
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

  checkAppPermissions(){
    return this.unitData.appPermission && 
    this.unitData.appPermission.checkOut && 
    this.unitData.appPermission.checkOut.businessApp === true &&
    this.unitData.isCheckOutAllowed
  }

  routeToCheckinForm() {
    if(this.checkAppPermissions() ){
      if(!this.emptyForm){
        this.router.navigate(["/rentals-check-out-form"], {
          queryParams: { 
            type: this.type, 
            home: this.unitId,
            tenant: this.tenant,
            door : this.unitData.listing && this.unitData.listing.door,
            block : this.unitData.listing && this.unitData.listing.block,
          },
        });
      }else{
        const data = {
          home: this.unitId,
          address: `${this.unitData.listing.block} ${this.unitData.listing.door}` || '',
        };
        this.router.navigate(['/rentals-invoices'], { queryParams:{ data:  JSON.stringify(data)}});
      }
    }else{
      this.alertService.presentAlert('','Checkout has been disabled for your account; kindly reach out to the administrator for assistance.');
    }
  }

}
