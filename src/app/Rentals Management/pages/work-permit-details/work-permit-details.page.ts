import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { StorageService } from 'src/app/common-services/storage-service.service';
import { WorkPermitService } from '../../services/work-permit.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import * as _ from 'lodash';
import { WorkStatusDropDownComponent } from '../../components/work-status-drop-down/work-status-drop-down.component';
import * as moment from 'moment';
import { ViewApprovalLevelsComponent } from '../../components/view-approval-levels/view-approval-levels.component';
import { PictureComponent } from 'src/app/common-components/picture/picture.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: "app-work-permit-details",
  templateUrl: "./work-permit-details.page.html",
  styleUrls: ["./work-permit-details.page.scss"],
})
export class WorkPermitDetailsPage implements OnInit {
  public loadingInstence: HTMLIonLoadingElement;
  public workPermitId: any;
  public workPermit: any;
  public basicDetails: any;
  public workerDetails: any;
  public customDetails: any = [];
  public isBasicDetailsRead: boolean = false;
  public isWorkerDetailsRead: boolean = false;
  public isCustomDetailsRead: any = {};
  public isTermsAndConditionRead: boolean = false;
  public rejectedWorkPermit: any = {}; 
  public remarkReason: string = "";
  public isApproved: Boolean = false;
  public isApprover: Boolean = false;
  public populate: any = ["listing", "workType","createdBy","approval.actionTakenBy"];
  public currentSection: string = "overview";
  public currentWorkStatus: any = {};
  public workStatusOptions = [
    { display: 'Not Started', value: 'not-started' },
    { display: 'On Hold', value: 'on-hold' },
    { display: 'In Progress', value: 'on-going' },
    { display: 'Completed', value: 'completed' }
  ];

  constructor(
    public transService: translateService,
    public storageService: StorageService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public workPermitService: WorkPermitService,
    public loadingCtrl: LoadingController,
    public alertService: AlertServiceService,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private iab: InAppBrowser
  ) {
    this.activatedRoute.queryParamMap.subscribe((data: any) => {
      if (data.params.workPermitId) {
        this.workPermitId = data.params.workPermitId;
      }
    });
  }

  ngOnInit() {
    this.getWorkPermitById();
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  getWorkPermitById() {
    this.presentLoading();
    this.workPermitService
      .getWorkPermitById(this.workPermitId, this.populate)
      .subscribe(
        (data: any) => {
          this.loadingCtrl.dismiss();
          this.workPermit = data;
          if(data.approvalStatus === 'approved'){
            this.currentSection = "approvalSection";
          }
          this.basicDetails = data.workPermitDetails;
          this.workerDetails = data.workerDetails;
          if (data.customSections.length > 0) {
            data.customSections.forEach((section) => {
              if (section.items && section.items.length > 0) {
                this.customDetails.push(section);
                this.isCustomDetailsRead[section.sectionName] = false;
              }
            });
          }
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = data.termsAndConditions;
          const termsAndConditionDiv =
            document.getElementById("termsAndCondition");
          console.log("termsAndConditionDiv", termsAndConditionDiv);
          if (termsAndConditionDiv) {
            termsAndConditionDiv.appendChild(tempDiv);
          }
          this.currentWorkStatus = this.workStatusOptions.find(
            (option) => option.value === this.workPermit.workStatus
          );
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
  async checkForApproval(workPermit) {
    let userId;
    await this.storageService.getDatafromIonicStorage("user_id").then((val) => {
      userId = val;
    });
    const { approval = [] } = workPermit;
    if (!_.isEmpty(approval)) {
      console.log("inside approval");
      _.forEach(approval, (level, index) => {
        if (level.approversList.includes(userId)) {
          // checking index becoz if only one level is there then it should be approved
          if(index !== 0 && !workPermit.allowAutomaticApprovalOfLowerLevel){
            this.isApprover = this.checkPreviousLevelApproval(approval, index);
          } else {
            this.isApprover = true;
          }
          if (
            level.status &&
            (level.status === "approved" || level.status === "rejected")
          ) {
            this.isApproved = true;
            this.currentSection = "approvalSection";
          } else if (this.currentSection !== "approvalSection") {
            this.currentSection = "overview";
            this.isApproved = false;
          }else{
            this.isApproved = false;
          }
        }
      });
    }
  }

  checkPreviousLevelApproval(approval, index = 1) {
    return approval[index - 1] && approval[index - 1].status && approval[index - 1].status === 'approved';
  }
  checkForRejected(workPermit) {
    if (!_.isEmpty(workPermit.approval)) {
      this.rejectedWorkPermit = workPermit.approval.find(
        (level) =>
          level.status === "rejected" &&
          level.reason &&
          level.reason.length > 0
      );

      const approvedWithRemark = workPermit.approval.find((level) => level.status === 'approved' && level.reason && level.reason.length > 0);

      if (!_.isEmpty(approvedWithRemark)) {
        this.remarkReason = approvedWithRemark.reason;
      }

      if (!_.isEmpty(this.rejectedWorkPermit) && this.rejectedWorkPermit.status === "rejected") {
        this.currentSection = "approvalSection";
      }
      console.log("rejectedWorkPermit", this.rejectedWorkPermit);
    }
  }

  formatTime(timeString: string): string {
    return timeString ? moment(timeString, 'HH:mm').format('h:mm A') : "N/A";
  }

  approve() {
    this.presentLoading();
    this.workPermitService.approve({ workPermit: this.workPermitId, status : "approve" }).subscribe(
      (res: any) => {
        this.loadingCtrl.dismiss();
        this.router.navigate(["/rentals-work-permit"], { });
        this.presentSuccessModal("Approved Successfully");
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  routeToRejction(type: string) {

    const title = type === "reject" ? "reject" : "remark" ;

    this.router.navigate(["/rentals-work-permit-rejection"], {
      queryParams: { workPermitId: this.workPermitId, type: title },
    });
  }

  async downloadWorkPermit() {
    let email;
    await this.alertService.getDataFromLoaclStorage("email").then((val) => {
      email = val;
    });
    this.presentLoading();
    this.workPermitService
      .downloadWorkPermit({
        workPermit: this.workPermitId,
        email,
        isLambdaTrigger: true,
      })
      .subscribe(
        (res: any) => {
          this.loadingCtrl.dismiss();
          this.presentSuccessModal(
            `The workpermit report has been emailed to the following email ID ${email}`
          );
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

  public presentDropDownPopover(ev: any,options = {}) {
    this.popoverCtrl.create({
      component: WorkStatusDropDownComponent,
      cssClass: 'work-permit-custom-popover',
      event: ev,
      componentProps: {
        workStatusOptions: this.workStatusOptions,
        currentWorkStatus: this.workPermit.workStatus || 'not-started',
        workPermitId: this.workPermitId
      }
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
          console.log("-----",data);
      })
    })
  }

  routeToSection(section: string) {
    this.currentSection = section;
  }

  goToApprovalSection() {
    this.currentSection = "approvalSection";
  }

  goToOverviewSection() {
    this.currentSection = "overview";
  }

  nextSection() {
    if (this.currentSection === "overview") {
      this.currentSection = "basicDetails";
    } else if (this.currentSection === "basicDetails") {
      this.currentSection = "workerDetails";
      this.isBasicDetailsRead = true;
    } else if (this.currentSection === "workerDetails") {
      // Start of custom sections
      if (this.customDetails.length > 0) {
        this.currentSection = this.customDetails[0].sectionName;
        this.isWorkerDetailsRead = true;
      } else {
        //if no custom sections then go to terms and condition section
        this.currentSection = "termsAndConditionSection";
        this.isWorkerDetailsRead = true;
      }
    } else if (
      this.customDetails.some(
        (section) => section.sectionName === this.currentSection
      )
    ) {
      // Find the current custom section
      const currentCustomSectionIndex = this.customDetails.findIndex(
        (section) => section.sectionName === this.currentSection
      );
      const currentCustomSectionName =
        this.customDetails[currentCustomSectionIndex].sectionName;
      if (currentCustomSectionIndex < this.customDetails.length - 1) {
        this.currentSection =
          this.customDetails[currentCustomSectionIndex + 1].sectionName;
        this.isCustomDetailsRead[currentCustomSectionName] = true;
      } else {
        this.currentSection = "termsAndConditionSection";
        this.isCustomDetailsRead[currentCustomSectionName] = true;
      }
    } else if (this.currentSection === "termsAndConditionSection") {
      this.currentSection = "approvalSection";
      this.isTermsAndConditionRead = true;
    }
  }
  previousSection() {
    if (this.currentSection === "approvalSection") {
      this.currentSection = "termsAndConditionSection";
    } else if (this.currentSection === "termsAndConditionSection") {
      if (this.customDetails.length > 0) {
        this.currentSection =
          this.customDetails[this.customDetails.length - 1].sectionName;
      } else {
        //if no custom sections then go to worker details section
        this.currentSection = "workerDetails";
      }
      // End of custom sections
    } else if (
      this.customDetails.some(
        (section) => section.sectionName === this.currentSection
      )
    ) {
      // Find the current custom section
      const currentCustomSectionIndex = this.customDetails.findIndex(
        (section) => section.sectionName === this.currentSection
      );
      if (currentCustomSectionIndex > 0) {
        this.currentSection =
          this.customDetails[currentCustomSectionIndex - 1].sectionName;
      } else {
        this.currentSection = "workerDetails"; // Before custom sections
      }
    } else if (this.currentSection === "workerDetails") {
      this.currentSection = "basicDetails";
    } else if (this.currentSection === "basicDetails") {
      this.currentSection = "overview";
    }
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

  async viewApprovalLevels() {
    const modal = await this.modalCtrl.create({
      component: ViewApprovalLevelsComponent,
      componentProps: {
        title: "Work Permit created",
        data: this.workPermit
      },
      cssClass: 'view-approval-levels-modal'
    });

    modal.onDidDismiss().then((data: any) => {
      console.log("modal dismissed");
    });

    return await modal.present();
  }
}
