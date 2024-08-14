import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewPhotoComponent } from '../view-photo/view-photo.component';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';
import { Device } from '@ionic-native/device/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectSignOptionComponent } from '../../modals/select-sign-option/select-sign-option.component';

@Component({
  selector: 'app-checklist-summary',
  templateUrl: './checklist-summary.component.html',
  styleUrls: ['./checklist-summary.component.scss'],
})
export class ChecklistSummaryComponent implements OnInit {
  @Input()checkInPayload: any;
  @Input()type: any;
  public loadingInstence:HTMLIonLoadingElement
  public acceptItems = [];
  public acceptWithDefectItems = [];
  public rejectItems = [];
  public unitData: any = {};
  public stage: string = '';

  constructor(
    public transService: translateService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public router: Router,
    public checkInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService,
    public route: ActivatedRoute,
    private device: Device,
    private domSanitizer: DomSanitizer,

  ) { 
    
  }
  
  ngOnInit() {

    console.log("=======",this.checkInPayload,this.type);
    this.getUnitDetails();
    this.filterCheckListItems(this.checkInPayload.items);

  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  filterCheckListItems(items){
    this.acceptItems = items.filter(item =>
      item.options.some(option => option.selected && option.name === "Accept")
    );
    
    this.acceptWithDefectItems = items.filter(item =>
      item.options.some(option => option.selected && option.name === "Accept with defect")
    );
    
    this.rejectItems = items.filter(item =>
      item.options.some(option => option.selected && option.name === "Reject")
    );
  }

  edit(item){
    this.presentLoading();
    setTimeout(()=>{
      this.loadingCtrl.dismiss();
      this.modalCtrl.dismiss(item,'edit');
    },300)
  }

  public async getUnitDetails() {
    this.presentLoading();

    const payload = {
      unitId: this.checkInPayload.home,
    };
    try {
      const data: any = await this.checkInCheckOutService.getUnitDetails(payload).toPromise();
      setTimeout(()=>{
        this.loadingCtrl.dismiss();
      },300)
      this.unitData = data;
      this.stage = data.checkin && data.checkin.stage ? data.checkin.stage : "";
 
    } catch (err) {
      setTimeout(()=>{
        this.loadingCtrl.dismiss();
      },300)
      this.alertService.presentAlert("", err.error.message);
    }
  }

  async sign(){
    const modal = await this.modalCtrl.create({
      component: SignaturePadComponent,
      componentProps: {
        data: {
          stage: this.type !='re-confirm' ? ( this.stage === 'completed-by-staff' ? 'Tenant' : 'Staff' ) : "",
        }
      },
      cssClass: 'full-modal'
    });

    modal.onDidDismiss().then((data: any)=>{
      console.log("data",data);
      if(data.role == 'true' && data.data.files.length > 0){
        this.checkInPayload.signature = data.data.files[0]._id;
        if(this.type!='re-confirm'){
          this.completeCheckIn(this.checkInPayload);
        }else{
          this.reConfirm(this.checkInPayload);
        }
      }
      
      console.log("checkInPayload",this.checkInPayload);
    })
    return modal.present();
  }

  completeCheckIn(payload){
    const door = this.unitData.listing.door;
    const block = this.unitData.listing.block;

    payload.items = payload.items.map((item)=> {
      const { images, createdBy, _id, ...rest } = item;
      return rest
    })
  
    this.presentLoading();
    this.checkInCheckOutService.checkIn(payload).subscribe(async (res: any)=>{

      this.modalCtrl.dismiss();
      this.loadingCtrl.dismiss();

      await this.getUnitDetails();

      if (this.stage === "completed") {
        this.router.navigate(["/rentals-check-in"]);
        this.presentSuccessAlertModal(block, door);
      } else {
        this.presentTenantSignOption();
      }
      
    },(err)=>{
      this.modalCtrl.dismiss();
      this.loadingCtrl.dismiss();
      console.log(err);
      this.alertService.presentAlert('',err.error.message)
    })
  }

  async presentTenantSignOption() {
    const modal = await  this.modalCtrl.create({
      component: SelectSignOptionComponent,
      backdropDismiss: false,
      componentProps : {
        unitData: this.unitData
      },
      cssClass: 'select-tenant-sign-alert-modal '
    })
    modal.onDidDismiss().then((data)=>{
      if(data && data.data && data.data === 'sign'){
        this.sign();
      } else {
        this.presentSuccessAlertModal(this.unitData.listing.block, this.unitData.listing.door);
        this.router.navigate(['/rentals-check-in']);
      }
    })
    return modal.present();
  }

  

  reConfirm(payload){

    const door = this.unitData.listing.door;
    const block = this.unitData.listing.block;

    payload.items = payload.items.map((item)=> {
      const { images, createdBy, _id, ...rest } = item;
      return rest
    })

    this.presentLoading();
    this.checkInCheckOutService.reConfirm(payload).subscribe((data: any)=>{
      this.router.navigate(['/rentals-check-in']);
      this.modalCtrl.dismiss();
      this.loadingCtrl.dismiss();
      this.presentSuccessAlertModal(block, door);
    },(err)=>{
      console.log(err);
      this.loadingCtrl.dismiss();
      this.alertService.presentAlert('',err.error.message)
    })
  }

  async presentSuccessAlertModal(block, door){
    let modal = await this.modalCtrl.create({
      component: SuccessAlertModalComponent,
      componentProps: {
        data: {
          reference : 'CiCoChecklist',
          subHeader: this.stage === 'completed' || this.type === 're-confirm' ? 'Check-In Successful' : 'Staff signed' ,
          door,
          block
        }
      },
      cssClass: 'success-alert-modal'
    })

    modal.onDidDismiss().then((data: any) =>{
      if(data.data === true){
      }
      console.log("data",data);
    })
    return await modal.present();
  }

  async viewPhoto(images){
    // if(this.device.platform.toLocaleLowerCase() === 'ios'){
    //   images = images.map(image =>this.domSanitizer.bypassSecurityTrustUrl(image) )
    // }
    console.log(images);
    const modal = await this.modalCtrl.create({
      component : ViewPhotoComponent,
      componentProps : {
        images
      }
    });

    modal.onDidDismiss().then((data: any)=>{
      console.log(data);
    })

    return modal.present();

  }

  routeToInvoices(){
    this.router.navigate(['/rentals-invoices'], { queryParams:{ data:  JSON.stringify(this.checkInPayload)}});
    this.modalCtrl.dismiss();
  }

}
