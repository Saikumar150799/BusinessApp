import { Component, OnInit, Input } from "@angular/core";
import {  Router } from '@angular/router';
import { PopoverController, LoadingController, ModalController } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { WorkPermitService } from '../../services/work-permit.service';
import * as _ from 'lodash';
import { SuccessAlertModalComponent } from "../../modals/success-alert-modal/success-alert-modal.component";

@Component({
  selector: "app-work-status-drop-down",
  templateUrl: "./work-status-drop-down.component.html",
  styleUrls: ["./work-status-drop-down.component.scss"],
})
export class WorkStatusDropDownComponent implements OnInit {
  public loadingInstance: HTMLIonLoadingElement;
  @Input() workStatusOptions: Array<any>;
  @Input() currentWorkStatus: string;
  @Input() workPermitId: string;
  public selectedWorkStatus: string;

  constructor(
    public router: Router,
    public workPermitService: WorkPermitService,
    public loadingCtrl: LoadingController,
    public alertService: AlertServiceService,
    public transService: translateService,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.selectedWorkStatus = this.currentWorkStatus || "not-started";
    console.log("----- workStatusOptions ----", this.currentWorkStatus, this.selectedWorkStatus,  this.workPermitId, this.workStatusOptions);
  }

  onCancel() {
    // Handle the cancel action
    console.log("Cancel action");
    this.popoverCtrl.dismiss();
  }

  async onDone() {
    console.log("Done action");
    this.popoverCtrl.dismiss();
    console.log(
      "----- present values  ----",
      this.currentWorkStatus,
      this.selectedWorkStatus
    );
    const workStatus = this.workStatusOptions.find(option => option.value === this.selectedWorkStatus);
    let currentStatus = this.currentWorkStatus;
    let newStatus = this.selectedWorkStatus;
    if (
      currentStatus === "not-started" &&
      (newStatus === "completed" || newStatus === "on-hold")
    ) {
      //reason popup
      this.routeToRejction(newStatus);
    } else if (
      currentStatus === "on-going" &&
      (newStatus === "not-started" || newStatus === "on-hold")
    ) {
      //reason popup
      this.routeToRejction(newStatus);
    } else if (
      currentStatus === "on-hold" &&
      (newStatus === "not-started" || newStatus === "completed")
    ) {
      //reason popup
      this.routeToRejction(newStatus);
    } else if (
      currentStatus === "completed" &&
      (newStatus === "not-started" ||
        newStatus === "on-hold" ||
        newStatus === "on-going")
    ) {
      //reason popup
      this.routeToRejction(newStatus);
    } else {
      let data: any = {workPermit: this.workPermitId, rejectionReason: ''};
      console.log("daaa sedinddddddd", data);
      this.workPermitService.updateWorkStatus(data, newStatus).subscribe( async (res)=>{
        this.loadingCtrl.dismiss();
        await this.presentSuccessModal(`Work status updated to ${workStatus.display} successfully`);
        this.router.navigate(["/rentals-work-permit"],{replaceUrl: true});
  
      },(err)=>{
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert('',err.error.message)
      })
    }
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

  public selectOption() {
    // Handle the select option action
    console.log("Select option action", this.selectedWorkStatus);
  }

  routeToRejction(changeToStatus: string) {
    const workStatus = this.workStatusOptions.find(option => option.value === changeToStatus);
    let displayValue = "Work Status Change";
    if(!_.isEmpty(workStatus)) {
      displayValue = workStatus.display;
    }
    this.router.navigate(["/rentals-work-permit-rejection"], {
      queryParams: { workPermitId: this.workPermitId, type: displayValue, changedStatus: workStatus.value},
    });
  }
}
