import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';
import { SignaturePadComponent } from '../../components/signature-pad/signature-pad.component';
import { SelectSignOptionComponent } from '../../modals/select-sign-option/select-sign-option.component';

@Component({
  selector: "app-documnet",
  templateUrl: "./documnet.page.html",
  styleUrls: ["./documnet.page.scss"],
})
export class DocumnetPage implements OnInit {
  public navParamData: any;
  private loadingInstence: HTMLIonLoadingElement;
  public images = [];
  public selfie = [];
  public idCards =[];
  public emptyCheckList: boolean = false;
  public flow: string = "document";
  public onBoardingPayload: any =  {
    home: "",
    documents: []
  };
  public checkInPayload: any = {};
  public unitData: any = {};
  public stage: string = '';
  constructor(
    public transService: translateService,
    public route: ActivatedRoute,
    private actionSheet: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertService: AlertServiceService,
    public webview: WebView,
    public router: Router,
    public CheckInCheckOutService: CheckInCheckOutService,
    public modalCtrl: ModalController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params.data) {
        this.navParamData = JSON.parse(params.data);
        if(this.navParamData && this.navParamData.home){
          this.onBoardingPayload.home = this.navParamData.home;
          this.checkInPayload.home = this.navParamData.home;
        }
        if(this.navParamData && this.navParamData.tenant){
          this.onBoardingPayload.tenant = this.navParamData.tenant;
          this.checkInPayload.tenant = this.navParamData.tenant;
        }
        console.log("INNNN",this.navParamData);
      }
    });
  }

  ngOnInit() {
    this.getUnitDetails();
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  public uploadDocument() {
    this.actionSheet
      .create({
        header: `${this.transService.getTranslatedData("Select image from")}`,
        buttons: [
          {
            text: `${this.transService.getTranslatedData('Camera')}`,
            icon: 'camera',
            handler: async () => {
              this.fileSourceOption('camera');
            }
          },
          {
            text: `${this.transService.getTranslatedData("Library")}`,
            icon: "images",
            handler: () => {
              this.fileSourceOption("library");
            },
          },
          {
            text: `${this.transService.getTranslatedData("Cancel")}`,
            icon: "close",
            handler: () => {
              console.log("cancel");
            },
          },
        ],
      })
      .then((actionsheet) => {
        actionsheet.present();
      });
  }

  async fileSourceOption(type: string) {
    const caller = await this.alertService.capturePhoto(type);
    if (caller) {
      console.log(caller);
      await this.presentLoading();
      this.images.push(caller);
      this.alertService.getPutSignedUrl(caller).subscribe(
        (res) => {
          console.log(res);
          this.idCards.push(res._id);
          this.alertService
            .s3BucketFileTransfer(caller, res.url)
            .then(() => {
              this.loadingInstence.dismiss();
            })
            .catch(() => {
              this.loadingInstence.dismiss();
            });
        },
        (err) => {
          this.loadingInstence.dismiss();
        }
      );
    }
  }

  openCamera() {
    this.actionSheet
      .create({
        header: `${this.transService.getTranslatedData("Select image from")}`,
        buttons: [
          {
            text: `${this.transService.getTranslatedData('Camera')}`,
            icon: 'camera',
            handler: async () => {
              this.captureImage('camera');
            }
          },
          {
            text: `${this.transService.getTranslatedData("Library")}`,
            icon: "images",
            handler: () => {
              this.captureImage("library");
            },
          },
          {
            text: `${this.transService.getTranslatedData("Cancel")}`,
            icon: "close",
            handler: () => {
              console.log("cancel");
            },
          },
        ],
      })
      .then((actionsheet) => {
        actionsheet.present();
      });
  }

  async captureImage(type: string) {
    const caller = await this.alertService.capturePhoto(type);
    if (caller) {
      console.log(caller);
      await this.presentLoading();
      this.selfie = [];
      this.selfie.push(caller);
      this.alertService.getPutSignedUrl(caller).subscribe(
        (res) => {
          console.log(res);
          this.onBoardingPayload.documents[0] = {type : 'selfie', id: res._id};
          this.alertService
            .s3BucketFileTransfer(caller, res.url)
            .then(() => {
              this.loadingInstence.dismiss();
            })
            .catch(() => {
              this.loadingInstence.dismiss();
            });
        },
        (err) => {
          this.loadingInstence.dismiss();
        }
      );
    }
  }

  skip() {
    this.presentLoading();
    setTimeout(() => {
      this.flow = "camera";
      this.loadingCtrl.dismiss();
    }, 300);
  }

  goBack() {
    if (this.flow === "document") {
      this.router.navigate(["/rentals-check-in-details",]);
    } else {
      this.presentLoading();
      setTimeout(() => {
        this.flow = "document";
        this.loadingCtrl.dismiss();
      }, 200);
    }
  }

  removeImage(index) {
    this.images = this.images.filter((img, i) => i != index);
    this.idCards = this.idCards.filter((value,i)=> i !=index);
    console.log("removed",this.onBoardingPayload,this.idCards,this.images);
  }

  completeVerfication(){

    if(this.idCards.length > 0){
      const cards = this.idCards.map((value,index)=>({type : "others", frontSideId : this.idCards[0],backSideId: this.idCards[1]}));
      this.onBoardingPayload.documents[1] = (cards[0]);
    }

    this.presentLoading();
    this.CheckInCheckOutService.onBoarding(this.onBoardingPayload).subscribe((res: any)=>{
      setTimeout(()=>{
        this.loadingCtrl.dismiss();
        this.getChecklistByHome(this.navParamData.home);
      },300)
    },(err)=>{
      setTimeout(()=>{
        this.loadingCtrl.dismiss();
      },300)
      console.log(err);
      this.alertService.presentAlert('',err.error.message);
    })

  }

  getChecklistByHome(homeId) {
    this.CheckInCheckOutService.getChecklistByHome(homeId).subscribe(
      (data: any) => {
        this.checkInPayload.acceptedTermAndCondition = data.checkInTermAndCondition || [] ;
        this.emptyCheckList = data.checklistItems && data.checklistItems.length != 0 ? true : false ;
        if(!this.emptyCheckList || this.stage === 'completed-by-staff'){
          this.sign();
        }else{
          this.routeToCheckinForm();
        }
      },
      (err) => {
        console.log("Error", err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  public async getUnitDetails() {
  const payload = {
    unitId: this.checkInPayload.home,
  };
  try {
    const data: any = await this.CheckInCheckOutService.getUnitDetails(payload).toPromise();
    this.unitData = data;
    this.stage = data.checkin && data.checkin.stage ? data.checkin.stage : "";
  } catch (err) {
    this.alertService.presentAlert("", err.error.message);
  }
}

  async sign(){
    const modal = await this.modalCtrl.create({
      component: SignaturePadComponent,
      componentProps: {
        data: {
          stage: this.stage === 'completed-by-staff' ? 'Tenant' : 'Staff'
        }
      },
      cssClass: 'full-modal'
    });

    modal.onDidDismiss().then((data: any)=>{
      if(data.role == 'true' && data.data.files.length > 0){
        this.checkInPayload.signature = data.data.files[0]._id;
        console.log("checking payload",this.checkInPayload);
        this.completeCheckIn();
      }
    })
    return modal.present();
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
        this.presentSuccessAlertModal(this.navParamData.block,this.navParamData.door);
        this.router.navigate(['/rentals-check-in']);
      }
    })
    return modal.present();
  }

  async completeCheckIn(){

    this.presentLoading();

    this.CheckInCheckOutService.checkIn(this.checkInPayload).subscribe(async (res: any)=>{

      this.loadingCtrl.dismiss();
      
      await this.getUnitDetails();

      if (this.stage === "completed") {
        this.router.navigate(["/rentals-check-in"]);
        this.presentSuccessAlertModal(this.navParamData.block,this.navParamData.door);
      } else {
        this.presentTenantSignOption();
      }

    },(err)=>{
      this.loadingCtrl.dismiss();
      console.log(err);
      this.alertService.presentAlert('',err.error.message)
    })
  }

  async presentSuccessAlertModal(block, door){
    let modal = await this.modalCtrl.create({
      component: SuccessAlertModalComponent,
      componentProps: {
        data: {
          reference : 'CiCoChecklist',
          subHeader: this.stage === 'completed' ? 'Check-In Successful' : 'Staff signed',
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

  routeToCheckinForm(){
    this.router.navigate(['/rentals-checkin-in-form'], 
    {queryParams : { 
      home: this.navParamData.home, 
      tenant: this.navParamData.tenant, 
      door: this.navParamData.door,
      block: this.navParamData.block
    }});

  }
}
