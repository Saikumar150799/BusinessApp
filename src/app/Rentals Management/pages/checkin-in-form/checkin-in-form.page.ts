import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { AddPhotoComponent } from '../../components/add-photo/add-photo.component';
import { ChecklistSummaryComponent } from '../../components/checklist-summary/checklist-summary.component';

@Component({
  selector: "app-checkin-in-form",
  templateUrl: "./checkin-in-form.page.html",
  styleUrls: ["./checkin-in-form.page.scss"],
})
export class CheckinInFormPage implements OnInit {
  public checkInFormData: any = {};
  public homeId: any;
  public loadingInstence: HTMLIonLoadingElement;
  public formData: any = {};
  public emptyForm: boolean = false;
  public acceptAndRejectImages = [];
  public editItem: any;
  public flow: string = "";
  public permissions: any = {};
  terms = [];
  termCheckboxes: boolean[] = [];
  public checklistId: any
  public type = "";
  constructor(
    public transService: translateService,
    public route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public CheckInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log("PPPPPP", params);
      if (params.home) {
        this.checkInFormData.home = params.home;
        this.checkInFormData.tenant = params.tenant;
      }
      if (params.type) {
        this.homeId = params.home;
        this.type = params.type ? params.type : "";
      }
    });
    this.termCheckboxes = new Array(this.terms.length).fill(false);
  }

  ngOnInit() {
    console.log(this.checkInFormData, this.permissions, this.type);
    if (this.type === "re-confirm") {
      this.getUnitDetails();
      this.getChecklistId(this.checkInFormData.home); //Just to get the checklist ID
    } else {
      this.getChecklistByHome(this.checkInFormData.home);
    }
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }


  getChecklistByHome(homeId) {
    this.presentLoading();
    this.CheckInCheckOutService.getChecklistByHome(homeId).subscribe(
      (data: any) => {
        console.log("FormData", data);
        this.formData = data;
        if (data.checkInTermAndCondition.length > 0) {
          this.terms = data.checkInTermAndCondition;
        }
        this.emptyForm =
          this.formData && this.formData.checklistItems && this.formData.checklistItems.length > 0
            ? false
            : true;
        setTimeout(() => {
          this.loadingCtrl.dismiss();
        }, 300);
      },
      (err) => {
        console.log("Error", err);
        setTimeout(() => {
          this.loadingCtrl.dismiss();
        }, 200);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  getChecklistId(home){
    this.CheckInCheckOutService.getChecklistByHome(home).subscribe(
      (data: any) => {
        if(data){
          this.checklistId = data._id;
          this.checkInFormData.checkInTermAndCondition = data.checkInTermAndCondition;
          console.log("checklistId",data);
        }
      },
      (err) => {
        console.log("Error", err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  getUnitDetails() {
    this.presentLoading();
    const payload = {
      unitId: this.homeId,
      showRejectedItems: `&showRejectedItems=true`,
    };
    this.CheckInCheckOutService.getUnitDetails(payload).subscribe(
      (data: any) => {
        this.loadingCtrl.dismiss();
        console.log("daaaaaa", data);
        // renaming rejectedItems to checklistItems 
        this.formData = { checklistItems: data.rejectedItems, ...data };
        // this.formData = data
        // this.formData.checklistItems = data.rejectedItems;
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }


  handleRadioChange(selectedOption: any, item): void {
    item.options.forEach((option) => {
      option.selected = option._id === selectedOption._id;
    });
    switch (selectedOption.name) {
      case "Accept":
        item.handover = { type: "accept", files: [] };
        item.images = [];
        break;
      case "Accept with defect":
        item.handover = { type: "accept-with-defect", files: [] };
        item.images = [];
        this.presentAddNote(item);
        break;
      case "Reject":
        item.handover = { type: "reject", files: [] };
        item.images = [];
        this.presentAddNote(item);
        break;
      default:
        break;
    }

    console.log("selectedOption", this.termCheckboxes);
  }

  async presentAddNote(item) {
    const modal = await this.modalCtrl.create({
      component: AddNoteComponent,
      componentProps: {
        item,
      },
      cssClass: "full-modal",
    });
    modal.onDidDismiss().then((data: any) => {
      if (data && data.role === "true" && data.data) {
        Object.assign(item, data.data.item);
      }
      if (
        data.data.handover.files.length === 0 ||
        data.data.handover.comment == ""
      ) {
        item.options = item.options.map((option) => ({
          ...option,
          selected: false,
        }));
        this.cdr.detectChanges();
      }
      // else{
      //   item.options = item.options.map(option => ({ ...option, selected: false }));
      //   this.cdr.detectChanges();
      //   console.log("warn");
      // }
      console.log("===========", data);
    });

    return modal.present();
  }

  async addPhoto(item) {
    const modal = await this.modalCtrl.create({
      component: AddPhotoComponent,
      componentProps: {
        item,
      },
      cssClass: "custon-bottom-add-photo",
    });

    modal.onDidDismiss().then((data: any) => {
      if (data && data.role === "'true'" && data.data) {
        Object.assign(item, data.data.item);
      }
      console.log("object", data);
    });

    return modal.present();
  }

  showValue(item) {
    console.log("OOOo", item);
  }

  async navigateToSummary() {
    // const itemData = this.formData.checklistItems.map((item)=>{
    //   const { createdBy, _id, images, ...newItem } = item;
    //   return newItem
    // })
    this.checkInFormData.items = this.formData.checklistItems;
    this.checkInFormData.checklist = this.type === 're-confirm' ? this.checklistId  : this.formData._id;

    this.checkInFormData.checkInTermAndCondition = this.formData.checkInTermAndCondition;

    console.log("=======", this.checkInFormData);

    const modal = await this.modalCtrl.create({
      component: ChecklistSummaryComponent,
      componentProps: {
        checkInPayload: this.checkInFormData,
        type: this.type
      },
    });

    modal.onDidDismiss().then((data) => {
  
      if (data.data && data.role === "edit") {
        this.flow = data.role;
        this.editItem = data.data;
      }else{
        this.flow = "";
      }
      console.log(this.formData);
    });

    return modal.present();
  }

  navigate(){
    this.navigateToSummary();
    console.log("call",this.flow);
  }

  // All the items should be selected and with the checkboxes
  checkValidation(): boolean {
    return (
      this.formData.checklistItems &&
      this.terms.length === this.termCheckboxes.length &&
      this.termCheckboxes.every((value) => value === true) &&
      this.formData.checklistItems.every((item) =>
        item.options.some((option) => option.selected)
      )
    );
  }
}
