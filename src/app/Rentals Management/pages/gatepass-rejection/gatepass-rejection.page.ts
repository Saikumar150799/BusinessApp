import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { GatePassService } from '../../services/gatepass/gate-pass.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: "app-gatepass-rejection",
  templateUrl: "./gatepass-rejection.page.html",
  styleUrls: ["./gatepass-rejection.page.scss"],
})
export class GatepassRejectionPage implements OnInit {
  public loadingInstance: HTMLIonLoadingElement;
  public rejectionData: any = {};
  public reasonCount: number = 0;
  public title: string = "Reason";
  public type: string = "reject" ;
  constructor(
    public transSerivce: translateService,
    public router: Router,
    public loadingCtrl: LoadingController,
    public gatePassService: GatePassService,
    public alertService: AlertServiceService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data)=>{

      if(data.gatePassId){
        this.rejectionData.gatePass = data.gatePassId;
      }

      if(data.type){
        this.type = data.type || this.type;
        this.title = data.type === "remark" ? "Reason for remarks" : "Reason for rejection";
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
    this.router.navigate(["/rentals-gatepas-details"]);
  }

  handleChange() {
    this.reasonCount = this.rejectionData.rejectionReason.trim().length;
  }

  rejectGatePass() {
    this.presentLoading();
    this.gatePassService.reject(this.rejectionData).subscribe((res)=>{
      this.loadingCtrl.dismiss();
      this.router.navigate(["/rentals-gatepass"],{replaceUrl: true});

    },(err)=>{
      this.loadingCtrl.dismiss();
      console.log(err);
      this.alertService.presentAlert('',err.error.message)
    })
  }

  approveWithRemark() {
    this.presentLoading();
    this.gatePassService.approve(this.rejectionData).subscribe((res) => {
      this.loadingCtrl.dismiss();
      this.router.navigate(["/rentals-gatepass"], { replaceUrl: true });
    }, (err) =>{
      this.loadingCtrl.dismiss();
      console.error(err);
      this.alertService.presentAlert('',err.error.message || "Something went wrong")
    })
  }
}
