import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectionStrategy } from '@angular/core';
import {
  LoadingController,
  ModalController,
  AlertController,
  ActionSheetController,
  NavController,
  Events,
} from "@ionic/angular";
import { TicketService } from "../../services/ticket.service";
import { UserSearchPage } from "../../pages/user-search/user-search.page";
import { MaterialSearchPage } from "../../pages/material-search/material-search.page";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { TranslateService } from "@ngx-translate/core";
import { PictureComponent } from "src/app/common-components/picture/picture.component";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Device } from "@ionic-native/device/ngx";
import { StorageService } from "../../../common-services/storage-service.service";
import * as orgFile from "../../../conatants/organization.json";
import { DataService } from "../../services/data/data.service";
import * as _ from  'lodash';
import { TicketReOpenComponent } from "../../components/ticket-re-open/ticket-re-open.component";
import { TicketOnHoldComponent } from "../../components/ticket-on-hold/ticket-on-hold.component";
import { RentalsUserService } from "../../services/rentals-user.service";
import * as moment from "moment";

interface ticketConfig {
  isImageUploadMandatoryForTicketClosing: boolean,
  canCreatorOnlyReOpenTicket: boolean,
  canEditResolvedTicket: boolean,
}

@Component({
  selector: "app-ticket-details",
  templateUrl: "./ticket-details.page.html",
  styleUrls: ["./ticket-details.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetailsPage implements OnInit {
  public app = orgFile.appBundleId;
  public eventType = "";
  public interval: any;
  public hideLoading = false;
  private loadingInstence: HTMLIonLoadingElement;
  public checklistProgess: number = 0;
  public checkListLoading: boolean = true;
  public emptyCheckList: boolean = false;
  public hasAccessToOnHoldTicket: boolean = false;
  public hasAccessToReOpenedTicket: boolean = false;
  public hasAccessToTicketReject: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private ticketService: TicketService,
    private modalController: ModalController,
    public alertService: AlertServiceService,
    private alertCtrl: AlertController,
    public transService: translateService,
    public trans: TranslateService,
    private actionSheet: ActionSheetController,
    public webview: WebView,
    public device: Device,
    private changeDetector: ChangeDetectorRef,
    private storageService: StorageService,
    private NavController: NavController,
    private router: Router,
    private dataService: DataService,
    public events: Events,
    public userService: RentalsUserService
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      // tslint:disable-next-line: no-unused-expression
      params.params.ticketId ? (this.ticketId = params.params.ticketId) : "";
      // tslint:disable-next-line: no-unused-expression
      params.params.ticketId
        ? (this.commentData.ticket = params.params.ticketId)
        : "";
      // tslint:disable-next-line: no-unused-expression
      params.params.flag ? (this.flag = params.params.flag) : "";
      // tslint:disable-next-line: no-unused-expression
      params.params.tid ? (this.ticketId = params.params.tid) : "";

      this.selectedTab = "SUMMARY"; 
      if(params.params.tab){
        this.selectedTab = params.params.tab;
      }

      if(this.flag == 'true'){
        this.getTicketDetails();
      }
      // this.getTicketDetails();
      params.params.eventType ? (this.eventType = params.params.eventType) : "";

      events.subscribe('reload:data', (data, itemId) => {
        if(data === 'checkList'){
          this.getCheckLists();
        }
      })
    });
  }

  public selectedTab;
  public ticketId: string;
  public ticket: any = {
    uid: "",
  };

  public fieldTypes = ["text", "textarea", "date", "time"];
  public commentData: any = {};
  public ticketToBeUpdated: any;
  public internalComments = [];
  public externalComments = [];
  public activeMaterialSection = "description";
  public materialData: any = {};
  public images: any[] = [];
  public flag = "false";
  public userId: string = "";
  public progressPercentage: any = 0;
  public progressValue: any;
  public organizationType: string = "";

  public moduleAccess: any = {
    tickets: {
      access: true,
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  };
  formData = {};
  files: any[] = [];
  public selectedPocTechnicainTab: string = 'poc';

  public segments: { value: string, label: string, dataPresent: boolean }[] = [
    { value: 'SUMMARY', label: 'SUMMARY', dataPresent: true },
    { value: 'ASSETS', label: 'ASSETS', dataPresent: false },
    { value: 'INTERNAL COMMENTS', label: 'INTERNAL COMMENTS', dataPresent: false },
    { value: 'EXTERNAL COMMENTS', label: 'EXTERNAL COMMENTS', dataPresent: false },
    { value: 'CHECKLIST', label: 'CHECKLIST', dataPresent: false },
    { value: 'QUOTATIONS', label: 'QUOTATIONS', dataPresent: false },
    { value: 'MATERIALS', label: 'MATERIALS', dataPresent: false }
  ];

  public ticketConfig: ticketConfig = {
    isImageUploadMandatoryForTicketClosing: false,
    canCreatorOnlyReOpenTicket: false,
    canEditResolvedTicket: false
}

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  async ngOnInit() {
    this.userId = await this.storageService.getDatafromIonicStorage("user_id");
    await this.storageService.getDatafromIonicStorage('organizationType').then((data) =>{
      this.organizationType = data;
    })
    this.getTicketDetails(true);
    console.log(this.images.length);
  }

  ionViewWillEnter() {
    // if (this.flag === 'true') {
    //   console.log('true', this.ticketId);
    //   this.flag = 'false';
    //   this.ticket = [];
    //   console.log('------------- flag is =' + this.flag);
    //   this.getTicketDetails();
    // }
  }

  async  showMaterialForm() {
    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticket);

    if(noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else {
      this.activeMaterialSection = "materialForm";
    }
  }

  hideMaterialForm() {
    this.activeMaterialSection = "description";
  }

  async getTicketDetails(loading = false) {
    if(loading) {
      await this.presentLoading();
    }
    await this.refreshToken();

    await this.alertService
      .getDataFromLoaclStorage("moduleAccess")
      .then(async (val: any) => {
        this.moduleAccess = JSON.parse(val);
      });
    this.ticketService.getTicketById(this.ticketId).subscribe(
      async (data: any) => {
        this.ticket = data;
        await this.getCheckLists();
        loading ? await this.loadingInstence.dismiss(): ""
        this.changeRouting();
        this.changeDetector.detectChanges();
        this.isJobEndDateExpired();
        this.sortSegments();
        // console.log(this.ticket);
      },
      async (err) => {
        if(err.error.message.includes('Ticket not found, please check your authorization and input fields')) {
          this.alertService.customPresentAlert('', 'You no longer have access to this ticket');
        } else {
          this.alertService.presentAlert("",this.transService.getTranslatedData( err.error.message || "something went wrong please try again"));
        }
         loading ? await this.loadingInstence.dismiss(): ""
      }
    );
  }

  sortSegments() {
    let segment;

    segment = this.segments.find((s) => s.value === "ASSETS");
    if (segment) segment.dataPresent =this.ticket && this.ticket.assets && this.ticket.assets.length !== 0;

    segment = this.segments.find((s) => s.value === "INTERNAL COMMENTS");
    if (segment) segment.dataPresent = this.internalComments.length !== 0;

    segment = this.segments.find((s) => s.value === "EXTERNAL COMMENTS");
    if (segment) segment.dataPresent = this.externalComments.length !== 0;

    segment = this.segments.find((s) => s.value === "CHECKLIST");
    if (segment) segment.dataPresent = !this.emptyCheckList;

    segment = this.segments.find((s) => s.value === "QUOTATIONS");
    if (segment) segment.dataPresent = this.ticket && this.ticket.estimates && this.ticket.estimates.length !== 0;

    segment = this.segments.find((s) => s.value === "MATERIALS");
    if (segment) segment.dataPresent = this.ticket && this.ticket.itemDetails && this.ticket.itemDetails.length !== 0;
   
    this.segments.sort((a, b) => Number(b.dataPresent) - Number(a.dataPresent));
    this.changeDetector.detectChanges();

  }

  public isJobEndDateExpired (): boolean {

    const currentDate = moment();

    const jobEndDate = moment(this.ticket.jobEndDate);

    return jobEndDate.isBefore(currentDate);
  }

  public async refreshToken() {
    this.userService.refreshToken().subscribe(data => {
      this.setValues(data);
    });
  }

  async setValues(data) {
    
    window.localStorage.setItem('hasAccessToOnHoldTicket', JSON.stringify( data.role.onHoldTicket || false) );
    this.storageService.storeDataToIonicStorage('hasAccessToOnHoldTicket',  JSON.stringify( data.role.onHoldTicket || false));

    window.localStorage.setItem('hasAccessToReOpenedTicket',  JSON.stringify(data.role.reOpenedTicket || false));
    this.storageService.storeDataToIonicStorage('hasAccessToReOpenedTicket',  JSON.stringify(data.role.reOpenedTicket || false));

    window.localStorage.setItem('ticketReject', data.role.moduleAddition && data.role.moduleAddition.ticketReject || false);
    this.alertService.saveToLocalStorage('ticketReject', data.role.moduleAddition && data.role.moduleAddition.ticketReject || false);

    window.localStorage.setItem('ticketConfig', JSON.stringify(data.organizationTicketConfig || {}));
    this.alertService.saveToLocalStorage('ticketConfig', JSON.stringify(data.organizationTicketConfig || {}));

    this.hasAccessToOnHoldTicket = await JSON.parse(window.localStorage.getItem('hasAccessToOnHoldTicket'));
    this.hasAccessToReOpenedTicket = await JSON.parse(window.localStorage.getItem('hasAccessToReOpenedTicket'));
    this.hasAccessToTicketReject = await JSON.parse(window.localStorage.getItem('ticketReject'));
    this.ticketConfig = await Object.assign(this.ticketConfig, JSON.parse(window.localStorage.getItem('ticketConfig')));

    this.changeDetector.detectChanges();

  }

  async getCheckLists() {
    this.ticketService.getCheckListByTicketId(this.ticketId).subscribe((data: any)=> {
      this.ticket.checklist = data ;
      this.emptyCheckList = !_.isEmpty(data) && !_.isEmpty(data.checklistSections) ? false : true;
      this.getProgressValue(this.ticket);
      this.checkListLoading = false;
      this.changeDetector.detectChanges();
    },(err)=>{
      console.log("err",err);
      this.checkListLoading = false;
      this.changeDetector.detectChanges();
      this.alertService.presentAlert('', err.error.message || 'Something went wrong');
    })
  }

  getProgressValue(ticket){
    let completedSectionCount = 0;
    if(ticket.checklist &&  ticket.checklist.checklistSections){
      ticket.checklist.checklistSections.forEach((section : any)=>{
        if(section.completed){
          completedSectionCount += 1
        }
      })
      this.progressPercentage = (completedSectionCount / ticket.checklist.checklistSections.length) * 100 ;
      this.progressValue = completedSectionCount / ticket.checklist.checklistSections.length;
    }

  }

  public sectionProgress = (sections,i) =>{
    const progressArray = sections.map((section) => {
      let answeredInSection = 0;
  
      section.checklistItems.forEach((item) => {
        if (this.fieldTypes.includes(item.fieldType)) {
          if (item.fieldValue) {
            answeredInSection += 1;
          }
        } else {
          answeredInSection += item.options.filter(option => option.selected === true).length;
        }
      });
  
      return `${answeredInSection}/${section.checklistItems.length}`;
    });
  
    return progressArray[i];
  }

  async getComments(ticketCommentType: string) {
    //to get userId from storage
    this.userId = await this.storageService.getDatafromIonicStorage("user_id");
    console.log(this.userId);

    this.commentData.ticketCommentType = ticketCommentType;
    this.ticketService.getTicketComments(this.commentData).subscribe(
      async (data: any) => {
        ticketCommentType === "internal"
          ? (this.internalComments = data.rows)
          : (this.externalComments = data.rows);
        setTimeout(() => {
          this.scrollToBottom();
        }, 200);
        this.changeDetector.detectChanges();
        this.hideLoading = true;
      },
      async (err) => {
        this.hideLoading = true;
        this.alertService.presentAlert(
          "",
          this.transService.getTranslatedData(
            "You don't have permission for this operation!"
          )
        );
        clearInterval(this.interval);
      }
    );
  }

  async updateTicket() {
    await this.presentLoading();

    this.ticketToBeUpdated.raisedBy = this.ticketToBeUpdated.raisedBy._id;

    if ( this.ticketToBeUpdated.contactPoints ) {
        this.ticketToBeUpdated.contactPoints = await this.getContactPointsIds(this.ticketToBeUpdated.contactPoints);
    }
    if (this.ticketToBeUpdated.agents) {
      this.ticketToBeUpdated.agents = this.ticketToBeUpdated.agents.map(
        (agent) => agent._id
      );
    }
    if (this.ticketToBeUpdated.estimates.length > 0) {
      this.ticketToBeUpdated.estimates = this.ticketToBeUpdated.estimates.map(
        (estimate) => estimate._id
      );
    }
    if (this.ticketToBeUpdated.ticketCategory) {
      this.ticketToBeUpdated.ticketCategory =
        this.ticketToBeUpdated.ticketCategoryId;
    }

    if (this.ticketToBeUpdated.ticketSubCategory) {
      this.ticketToBeUpdated.ticketSubCategory =
        this.ticketToBeUpdated.ticketSubCategoryId;
    }
    if (this.files.length > 0) {
      this.ticketToBeUpdated.files.push(this.files[0]);
    }
    if (this.ticketToBeUpdated.assets.length > 0) {
      this.ticketToBeUpdated.assets = this.ticketToBeUpdated.assets.map(
        (ele) => ele._id
      );
    }
    if(!_.isEmpty( this.ticketToBeUpdated.facility )) {
      this.ticketToBeUpdated.facility = this.ticketToBeUpdated.facility._id;
    }

    this.ticketService.updateTicket(this.ticketToBeUpdated).subscribe(
      async () => {
        this.loadingInstence.dismiss();

        this.alertService.presentAlert(
          "",
          this.transService.getTranslatedData("Ticket Updated")
        );
        console.log("ticket updated");
        this.activeMaterialSection = "description";
        this.materialData = {};
        this.files = [];
        this.getTicketDetails();
      },
      async (err) => {
        this.loadingInstence.dismiss();

        console.log("ticket updated");
        this.alertService.presentAlert(
          "",
          this.transService.getTranslatedData(
            "something went wrong please try again"
          )
        );
      }
    );
  }

  async routeToCheckList(ticket,i = 0){
    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(ticket);

    if (noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else if(this.isJobEndDateExpired()) {
      this.alertService.presentAlert( "", "The job end date of the ticket has expired.");
    } else {
      if (!ticket.checklist.completed) {
        this.dataService.setData(ticket);
        this.router.navigate(["/checklist"], {
          queryParams: { index: i },
        });
      }
    }
  }


  sendEmail(){
    console.log("res",this.userId);
    this.presentLoading();
    this.ticketService.sendChecklistReport(this.ticketId, this.userId).subscribe((res: any) =>{
      this.loadingCtrl.dismiss();
      this.alertService.presentAlert('', res.msg)
      console.log("res",res);
    },(err)=>{
      console.log(err);
      this.loadingCtrl.dismiss();
      this.alertService.presentAlert('', err.error.message);
    })

  }

  async openUserSearchModal(type, id) {
    // this.ticketToBeUpdated = Object.assign({}, this.ticket);
    this.ticketToBeUpdated = JSON.parse(JSON.stringify(this.ticket));
    let persons = [];

    if (type === "agent" && this.ticketToBeUpdated.agents) {
      persons = JSON.parse(JSON.stringify(this.ticketToBeUpdated.agents));
    } else if (type === "poc" && this.ticketToBeUpdated.contactPoints) {
      persons = await this.getContactPointsIds(this.ticketToBeUpdated.contactPoints);
    }

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        persons,
        type,
        id,
      },
    });

    modal.onDidDismiss().then((user) => {
      let isDuplicate: boolean;
      if (user !== null && user.data) {
        if (type === "agent") {
          isDuplicate = this.checkForDuplicateAgent(user.data);
          // this.ticketData.agentName = user.data.name;
          if (isDuplicate) {
            this.alertService.presentAlert(
              "",
              this.transService.getTranslatedData(
                "Duplicate technician selected"
              )
            );
          } else {
            if (id !== undefined) {
              user.data = user.data.filter((agent) => agent._id !== id);
            }
            this.ticketToBeUpdated.agents = user.data;
          }
          this.files = [];
          if (!isDuplicate) {
            this.updateTicket();
          }
        } else if (type === "poc") {
          this.ticketToBeUpdated.contactPoints = user.data;
          this.files = [];
          this.updateTicket();
        }
      }
    });

    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticketToBeUpdated);

    if(noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else {
      return await modal.present();
    }
  }

  async createComment(ticketCommentType: string) {
    await this.presentLoading();

    const data = {
      text: this.ticket.commentText,
      ticket: this.ticketId,
      ticketCommentType: ticketCommentType,
      type: "ticket",
    };

    this.ticketService
      .createComment(data)
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(
        async (data: any) => {
          this.loadingInstence.dismiss();

          this.getComments(this.commentData.ticketCommentType);
          this.ticket.commentText = "";
        },
        async (err) => {
          this.loadingInstence.dismiss();

          this.alertService.presentAlert(
            "",
            this.transService.getTranslatedData(
              "something went wrong please try again"
            )
          );
        }
      );
  }

  updateCheckList(status, index) {
    this.files = [];
    this.ticketToBeUpdated = Object.assign({}, this.ticket);

    this.ticketToBeUpdated.checklist[index].completed = status;

    this.updateTicket();
    this.activeMaterialSection = "description";
    this.materialData = {};
  }

  async openMaterialSearchModal() {
    const modal = await this.modalController.create({
      component: MaterialSearchPage,
      componentProps: {
        productId: this.materialData.product
          ? this.materialData.product._id
          : "",
      },
    });

    modal.onDidDismiss().then((materialData: any) => {
      console.log(materialData);

      this.materialData.name = materialData.data ? materialData.data.name : "";
      this.materialData.product = materialData.data ? materialData.data : "";
      this.changeDetector.detectChanges();
      console.log(this.materialData);
    });

    return await modal.present();
  }

  async tagMaterial() {
    this.files = [];
    this.ticketToBeUpdated = Object.assign({}, this.ticket);
    this.ticketToBeUpdated.itemDetails.push(this.materialData);
    this.updateTicket();
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
          this.alertService
            .s3BucketFileTransfer(caller, res.url)
            .then(() => {
              this.files.push(res);

              this.loadingInstence.dismiss();

              this.ticketToBeUpdated = Object.assign({}, this.ticket);
              console.log("files");
              console.log(this.files);
              console.log("Before Ticket Update");
              console.log(this.ticketToBeUpdated);
              this.updateTicket();
            })
            .catch(() => {
              this.loadingInstence.dismiss();
            });
        },
        (err) => {
          this.loadingInstence.dismiss();
        }
      );

      this.changeDetector.detectChanges();
    }
  }

  async removeImage(id) {
    const alert = await this.alertCtrl.create({
      header: this.transService.getTranslatedData(
        "ticket-details.remove-image"
      ),
      buttons: [
        {
          text: this.transService.getTranslatedData("ticket-details.update.no"),
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: this.transService.getTranslatedData(
            "ticket-details.update.yes"
          ),
          handler: () => {
            console.log(id);
            this.ticketToBeUpdated = Object.assign({}, this.ticket);
            this.ticketToBeUpdated.files = this.ticketToBeUpdated.files.filter(
              (value) => value._id !== id
            );
            this.updateTicket();
          },
        },
      ],
    });
    return alert.present();
  }

  async removeMaterial(id) {
    const alert = await this.alertCtrl.create({
      header: this.transService.getTranslatedData(
        "Are you sure you want to delete this material"
      ),
      buttons: [
        {
          text: this.transService.getTranslatedData("No"),
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: this.transService.getTranslatedData("Yes"),
          handler: () => {
            console.log(id);
            this.files = [];
            this.ticketToBeUpdated = Object.assign({}, this.ticket);
            this.ticketToBeUpdated.itemDetails =
              this.ticketToBeUpdated.itemDetails.filter(
                (value) => value._id !== id
              );
            this.updateTicket();
          },
        },
      ],
    });
 
    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticket);

    if(noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else {
      return alert.present();
    }
  }

  public presentActionSheet() {
    this.actionSheet
      .create({
        header: `${this.transService.getTranslatedData("Select image from")}`,
        buttons: [
          {
            text: `${this.transService.getTranslatedData("Camera")}`,
            icon: "camera",
            handler: async () => {
              this.fileSourceOption("camera");
            },
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
      .then(async (actionsheet) => {
        const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticket);

        if (noAccessToEditTicket) {
          this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
        } else {
          actionsheet.present();
        }

      });
  }

  public openImage(image: string) {
    this.modalController
      .create({
        component: PictureComponent,
        componentProps: { image },
      })
      .then((modal) => {
        modal.present();
      });
  }

  async updatStatus(status: string) {
    let title = "";
    const ticketActionStatus = ["resolved"];
    // title = this.transService.getTranslatedData(`Are you sure you want to mark this ticket as ${status == 'in-progress' ? status = 'in progress' : status}?`)
    // this.trans.get('Are you sure you want to mark this ticket as {{val}}', { val: status == 'in-progress' ? 'IN PROGRESS' : status.toUpperCase() }).subscribe((res: string) => {
    //   title = res
    // })
    this.files = [];
    this.ticketToBeUpdated = Object.assign({}, this.ticket);
    if (
      this.ticketToBeUpdated.status === "open" &&
      ticketActionStatus.includes(status) &&
      this.ticket.checklist &&
      this.ticket.checklist.isChecklistMandatoryForTicket &&
      !this.ticket.checklist.isChecklistMandatoryForTicket.value &&
      this.ticket.checklist.completed
    ) {

      const alert = await this.alertCtrl.create({
        header: this.transService.getTranslatedData(
          "Please change ticket status to in progress first"
        ),
        buttons: [
          {
            text: this.transService.getTranslatedData("Ok"),
            role: "ok",
          },
        ],
      });
      return alert.present();
    } else if (
      this.ticketToBeUpdated.status === "open" &&
      ticketActionStatus.includes(status) &&
      this.ticket &&
      this.ticket.checklist &&
      this.ticket.checklist.isChecklistMandatoryForTicket &&
      this.ticket.checklist.isChecklistMandatoryForTicket.value &&
      !this.ticket.checklist.completed
    ) {
      const alert = await this.alertCtrl.create({
        subHeader: this.transService.getTranslatedData(
          "TICKET RESOLUTION INCOMPLETE:"
        ),
        message:
          "Please complete the checklist assigned to this ticket to resolve this ticket",
        cssClass: "ticket-resolution-incomplete",
        buttons: [
          {
            text: this.transService.getTranslatedData("Okay"),
            role: "ok",
          },
        ],
      });
      return alert.present();
    } else if (status !== this.ticketToBeUpdated.status) {
      if (
        this.ticketToBeUpdated.status === "open" &&
        !this.ticketToBeUpdated.agent &&
        status !== "rejected"
      ) {
        title =
          "Technician/vendor is not tagged to this ticket. Do you still want to update the ticket status?";
      }
      const alert = await this.alertCtrl.create({
        header: this.transService.getTranslatedData(
          `Are you sure you want to mark this ticket as ${
            status === "in-progress" ? "in progress" : status
          }?`
        ),
        buttons: [
          {
            text: this.transService.getTranslatedData("No"),
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm Cancel");
            },
          },
          {
            text: this.transService.getTranslatedData("Yes"),
            handler: () => {
              this.ticketToBeUpdated.status = status;
              console.log(this.ticketToBeUpdated);
              this.updateTicket();
            },
          },
        ],
      });
      return alert.present();
    } else {
      this.alertService.presentAlert(
        "",
        `${this.transService.getTranslatedData(
          "Status of this ticket is already"
        )} ${this.transService.getTranslatedData(
          status === "in-progress" ? "in progress" : status
        )}`
      );
    }
  }

  async openTicketReOpen() {
    const modal = await this.modalController.create({
      component: TicketReOpenComponent,
      componentProps: {
        ticketId: this.ticketId
      }
    })
    modal.onDidDismiss().then((data: any)=> {
      if(data && data.data) {
        // this.events.publish('reload:data', 'tickets');
        // this.changeDetector.detectChanges();
        this.alertService.presentAlert("",this.transService.getTranslatedData("Ticket Updated"));
        this.getTicketDetails();
      }
    })
    if(this.ticketConfig.canCreatorOnlyReOpenTicket && this.userId !== this.ticket.createdBy) {
      this.alertService.presentAlert("", "You can't reopen this ticket. Only the ticket creator can reopen it.");
    } else {
      return modal.present();
    }
  }

  async openTicketOnHold() {
    const modal = await this.modalController.create({
      component: TicketOnHoldComponent,
      componentProps: {
        ticket: this.ticket
      }
    });
    modal.onDidDismiss().then((data: any)=> {
      if(data && data.data) {
        // this.events.publish('reload:data', 'tickets');
        // this.changeDetector.detectChanges();
        this.alertService.presentAlert("",this.transService.getTranslatedData("Ticket Updated"));
        this.getTicketDetails();
      }
    })

    if (this.ticket.status === "on-hold") {
      this.alertService.presentAlert(
        "",
        "Status of this ticket is already On-Hold"
      );
    } else {
      // const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticket);

      // if(noAccessToEditTicket) {
      //   this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
      // } else {
      // }
      return modal.present();
    }
  }

  public call(num) {
    if (num) {
      window.location.href = "tel:" + num;
    } else {
      this.alertService.presentAlert(
        "",
        this.transService.getTranslatedData("Phone number not found")
      );
    }
  }

  public convertImageUrl(url: string) {
    return this.device.platform.toLowerCase() === "android"
      ? this.webview.convertFileSrc(url)
      : url;
  }

  changeRouting() {
    if (this.eventType) {
      const tab = this.eventType === "ticket_internal_comment" ? "INTERNAL COMMENTS" : "EXTERNAL COMMENTS" ;
      const type = this.eventType === "ticket_internal_comment" ? "internal" : "external";
      this.selectedTab = tab;
      this.getComments(type);
    } else {
    }
  }


  async routToTicketEdit(ticket) {

    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(ticket);

    if(noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else {
      this.router.navigate(['/rentals-create-ticket'], {
        queryParams: {
          ticketId: ticket._id
        }
      })
    }

  }

  public async canEditResolvedRejectedTicket(ticket) {
    const ticketStatus = ["rejected", "resolved"];
    return ticketStatus.includes(ticket.status) && this.ticketConfig && this.ticketConfig.canEditResolvedTicket;
  }

  async uploadImage() {
    const activeUser = this.ticket.files.find(file => file.createdBy === this.userId);
    if(this.ticket.files && this.ticket.files.length && activeUser) {
      this.updatStatus('resolved');
    } else if(this.ticket.status === 'resolved') {
      this.alertService.presentAlert("", "Status of this ticket is already resolved");
    } else {
      const alert = await this.alertCtrl.create({
        subHeader: this.transService.getTranslatedData(
          "Please upload image(s) before resolving the ticket"
        ),
        buttons: [
          {
            text: this.transService.getTranslatedData("Cancel"),
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm Cancel");
            },
          },
          {
            text: this.transService.getTranslatedData("Upload"),
            handler: () => {
              this.presentActionSheet();
            },
          },
        ],
      });
      return alert.present();
    }
  }

  scrollToBottom() {
    let ele = document.getElementById("ionList");
    if (ele) {
      console.log("header", document.getElementById("header").offsetHeight);
      console.log("footer", document.getElementById("footer").offsetHeight);
      console.log("window.innerHeight", window.innerHeight);

      ele.style.height = `${
        window.innerHeight -
        (document.getElementById("header").offsetHeight +
          document.getElementById("footer").offsetHeight)
      }px`;
      ele.scrollTop = ele.scrollHeight;
    }
  }

  caller(type: string) {
    this.hideLoading = false;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.getComments(type);
    }, 5000);
  }

  clrInterval() {
    clearInterval(this.interval);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  async deleteUser(agent_id) {
    this.ticketToBeUpdated = JSON.parse(JSON.stringify(this.ticket));

    const noAccessToEditTicket = await this.canEditResolvedRejectedTicket(this.ticketToBeUpdated);

    if(noAccessToEditTicket) {
      this.alertService.presentAlert("", "You can't edit the ticket after it has been resolved or rejected");
    } else {
      this.ticketToBeUpdated.agents = this.ticketToBeUpdated.agents.filter(
        (agent) => agent._id !== agent_id
      );
      this.files = [];
      this.updateTicket();
    }
  }

  checkForDuplicateAgent(users) {
    let valueArr = users.map((user) => user._id);
    let isDuplicate = valueArr.some((item, idx) => {
      return valueArr.indexOf(item) != idx;
    });
    return isDuplicate;
  }

  async getContactPointsIds(persons){
    return persons.map(person => person._id ? person._id : person);
  }
}
