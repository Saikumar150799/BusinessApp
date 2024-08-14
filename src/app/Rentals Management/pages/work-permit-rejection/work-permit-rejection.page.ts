import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { GatePassService } from '../../services/gatepass/gate-pass.service';
import { WorkPermitService } from '../../services/work-permit.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';

@Component({
  selector: 'app-work-permit-rejection',
  templateUrl: './work-permit-rejection.page.html',
  styleUrls: ['./work-permit-rejection.page.scss'],
})
export class WorkPermitRejectionPage implements OnInit {
  public loadingInstance: HTMLIonLoadingElement;
  public rejectionData: any = {};
  public reasonCount: number = 0;
  public type: string = '';
  public title: string = '';
  public changedStatus: string = ''; 
  constructor(
    public transSerivce: translateService,
    public router: Router,
    public loadingCtrl: LoadingController,
    public gatePassService: GatePassService,
    public workPermitService: WorkPermitService,
    public alertService: AlertServiceService,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data)=>{
      if(data.workPermitId){
        this.rejectionData.workPermit = data.workPermitId;
      }
      if(data.type){
        this.type = data.type;
        this.title = this.type === 'remark' ? 'remarks' : this.type;
        this.rejectionData.status = this.type === 'reject' ? 'reject' : 'approve' ;
      }
      if(data.changedStatus){
        this.changedStatus = data.changedStatus;
      }
    })
  }

  async presentLoading() {
    this.loadingInstance = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstance.present();
  }

  close() {
    this.router.navigate(["/rentals-work-permit-details"]);
  }

  handleChange() {
    this.reasonCount = this.rejectionData.rejectionReason.trim().length;
  }

  rejectWorkPermit() {
    this.presentLoading();
    this.rejectionData.rejectionReason = this.rejectionData.rejectionReason.trim();

    if(this.type === 'reject'){
      this.workPermitService.reject(this.rejectionData).subscribe((res)=>{
        this.loadingCtrl.dismiss();
        this.router.navigate(["/rentals-work-permit"],{replaceUrl: true});
  
      },(err)=>{
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert('',err.error.message)
      })
    } else if(this.type === 'remark'){
      this.approveWithRemark();
    } else {
      this.workPermitService.updateWorkStatus(this.rejectionData, this.changedStatus).subscribe( async (res)=>{
        this.loadingCtrl.dismiss();
        await this.presentSuccessModal(`Work status updated to ${this.type} successfully`);
        this.router.navigate(["/rentals-work-permit"],{replaceUrl: true});
  
      },(err)=>{
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert('',err.error.message)
      })
    }
  }

  approveWithRemark() {
    this.workPermitService.approve(this.rejectionData).subscribe(
      (res: any) => {
        this.loadingCtrl.dismiss();
        this.router.navigate(["/rentals-work-permit"], { });
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  async presentSuccessModal(customText: string) {
    this.modalCtrl
      .create({
        component: SuccessAlertModalComponent,
        componentProps: {
          data: {
            reference: "common",
            subHeader: customText,
          },
        },
        cssClass: "success-alert-modal",
      })
      .then((modal) => {
        modal.onDidDismiss().then((data: any) => {
          console.log("modal dismissed");
        });

        modal.present();
      });
  }

}
