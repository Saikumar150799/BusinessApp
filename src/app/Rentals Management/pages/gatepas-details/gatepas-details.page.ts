import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { GatePassService } from '../../services/gatepass/gate-pass.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';
import { StorageService } from 'src/app/common-services/storage-service.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ViewApprovalLevelsComponent } from '../../components/view-approval-levels/view-approval-levels.component';
import { PictureComponent } from 'src/app/common-components/picture/picture.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-gatepas-details",
  templateUrl: "./gatepas-details.page.html",
  styleUrls: ["./gatepas-details.page.scss"],
})
export class GatepasDetailsPage implements OnInit {
  public loadingInstence: HTMLIonLoadingElement;
  public selectedTab: string = "visitor-details";
  public expandIndex: number;
  public gatePassId: any;
  public gatePass: any;
  public rejectedGatePass = {};
  public remarkReason: string = "";
  public isApproved: Boolean = false;
  public isApprover: Boolean = false;
  public materials: any = {};
  constructor(
    public transService: translateService,
    public storageService: StorageService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public gatePassService: GatePassService,
    public loadingCtrl: LoadingController,
    public alertService: AlertServiceService,
    public modalCtrl: ModalController,
    private iab: InAppBrowser
  ) {
    this.activatedRoute.queryParamMap.subscribe((data: any) => {
      if (data.params.gatePassId) {
        this.gatePassId = data.params.gatePassId;
      }
    });
  }

  ngOnInit() {
    this.selectedTab = "visitor-details";
    console.log("gatePassid", this.gatePassId);
    this.getGatePassById();
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  getGatePassById() {
    this.presentLoading();
    this.gatePassService.getGatePassById(this.gatePassId).subscribe(
      (data: any) => {
        this.loadingCtrl.dismiss();
        this.gatePass = data;
        this.materials = data.materialDetails;
        this.checkForRejected(data);
        this.checkForApproval(data);
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  async checkForApproval(gatepass) {
    let userId;
    await this.storageService.getDatafromIonicStorage('user_id').then(val => {
      userId = val;
    })
    const { approval = [] } = gatepass;
    if (!_.isEmpty(approval)) {
      console.log("inside approval");
      _.forEach(approval, (level, index) => {
        if (level.approversList.includes(userId)) {
          // checking index becoz if only one level is there then it should be approved
          if(index !== 0 && !gatepass.allowAutomaticApprovalOfLowerLevel){
            this.isApprover = this.checkPreviousLevelApproval(approval, index);
          } else {
            this.isApprover = true;
          }
          if (level.status && (level.status === 'approved' || level.status === 'rejected')) {
            this.isApproved = true;
          } else {
            this.isApproved = false;
          }
        }
      })
    }
  }
  
  checkPreviousLevelApproval(approval, index = 1) {
    return approval[index - 1] && approval[index - 1].status && approval[index - 1].status === 'approved';
  }

  checkForRejected(gatepas){
    if(!_.isEmpty(gatepas.approval)){
      this.rejectedGatePass = gatepas.approval.find((level) => level.status === 'rejected' && level.reason && level.reason.length > 0);
      const approvedWithRemark = gatepas.approval.find((level) => level.status === 'approved' && level.reason && level.reason.length > 0);
      if (!_.isEmpty(approvedWithRemark)) {
        this.remarkReason = approvedWithRemark.reason;
      }
    }
  }
  tabChanged(event) {
    console.log(this.selectedTab);
  }

  toggle(index) {
    this.expandIndex = this.expandIndex === index ? null : index;
  }

  routeToRejction(type: string) {
    this.router.navigate(["/rentals-gatepass-rejection"], {
      queryParams: { gatePassId: this.gatePassId, type },
    });
  }

  approve() {
    this.presentLoading();
    this.gatePassService.approve({ gatePass: this.gatePassId }).subscribe(
      (res: any) => {
        this.loadingCtrl.dismiss();
        this.router.navigate(["/rentals-gatepass"], { replaceUrl: true });
        this.presentSuccessModal('Approved Successfully');
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  async downloadGatePass(){
    let email;
    await this.alertService.getDataFromLoaclStorage('email').then(val => {
      email = val;
    });
    this.presentLoading();
    this.gatePassService.downloadGatePass({ gatePass: this.gatePassId, email, isLambdaTrigger : true }).subscribe(
      (res: any) => {
        this.loadingCtrl.dismiss();
        this.presentSuccessModal(`The gatepass report has been emailed to the following email ID ${email}`);
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  getValue(item) {
    if (!_.isEmpty(item)) {
      if (
        (item.fieldType === "dropdown" ||
          item.fieldType === "radio" ||
          item.fieldType === "checkbox") && item.options 
      ) {
        const selectedOption = item.options.find((option) => option.selected);
        if (selectedOption) {
          return selectedOption.name;
        } else {
          return "N/A";
        }
      } else {
        return item.fieldValue || "N/A";
      }
    }
  }

  getFieldValue(field) {

    if (!_.isEmpty(field)) {
      if (
        (field.fieldType === "dropdown" || field.fieldType === "radio") &&
        field.options
      ) {
        const selectedOption = field.options.find((option) => option.selected);
        if (selectedOption) {
          return selectedOption.name;
        } else {
          return "N/A";
        }
      } else if (field.fieldType === "checkbox") {
        const selectedOptions = field.options.filter(
          (option) => option.selected
        );
        if (selectedOptions.length > 0) {
          const names = selectedOptions.map((item) => item.name);
          return names;
        }
      } else if (field.fieldType === "date") {
        return field.fieldValue ? moment(field.fieldValue).format("DD-MM-YYYY") : "N/A";
      } else if (field.fieldType === "time") {
        return field.fieldValue ? moment(field.fieldValue, "HH:mm").format("h:mm A") : 'N/A';
      } else {
        return field.fieldValue;
      }
    }
  }

  formatTime(timeString: string): string {
    return timeString ? moment(timeString, 'HH:mm').format('h:mm A') : "N/A";
  }

  async viewApprovalLevels() {
    const modal = await this.modalCtrl.create({
      component: ViewApprovalLevelsComponent,
      componentProps: {
        title: "Gate Pass created",
        data: this.gatePass
      },
      cssClass: 'view-approval-levels-modal'
    });

    modal.onDidDismiss().then((data: any) => {
      console.log("modal dismissed");
    });

    return await modal.present();
  }

  public async openImage(doc, image: string) {

    const fileFormat = 'image';
    if(doc.fileFormat.includes(fileFormat)) {
      await this.modalCtrl
      .create({
        component: PictureComponent,
        componentProps: { image },
      })
      .then((modal) => {
        modal.present();
      });
    } else {
      const browser = this.iab.create(doc.aws_compressed_url, '_system'); // Use '_blank' for opening within the app
      browser.show();
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
}
