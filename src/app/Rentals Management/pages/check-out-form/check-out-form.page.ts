import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { ActivatedRoute } from '@angular/router';
import { ChecklistSummaryComponent } from '../../components/checklist-summary/checklist-summary.component';
import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { AddPhotoComponent } from '../../components/add-photo/add-photo.component';
import * as _ from 'lodash'

@Component({
  selector: 'app-check-out-form',
  templateUrl: './check-out-form.page.html',
  styleUrls: ['./check-out-form.page.scss'],
})
export class CheckOutFormPage implements OnInit {
  public loadingInstence: HTMLIonLoadingElement;
  public formData: any = {};
  public emptyForm: boolean = false;
  public checkOutPayload: any = {};
  public type = ""; 
  public flow: string = "";
  public editItem: any;
  public terms = [];
  public termCheckboxes: boolean[] = [];
  constructor(
    public transService: translateService,
    public loadingCtrl: LoadingController,
    public CheckInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService,
    public checkInCheckOutService: CheckInCheckOutService,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) { 
    this.route.queryParams.subscribe((params) => {
      this.checkOutPayload.address = params.block + ' ' + params.door;
      this.checkOutPayload.home = params.home;
      this.checkOutPayload.tenant = params.tenant;
      this.type = params.type;

    })
    this.termCheckboxes = new Array(this.terms.length).fill(false);
  }
  public Options: any = { 
    'Accept': 'Recevied',
    'Accept with defect': 'Recevied with defect',
    'Reject': 'Reject'
  };
  ngOnInit() {
    this.getUnitDetailsByHome();
    this.getChecklistByHome();
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }



  getUnitDetailsByHome(){
    this.presentLoading();
    this.checkInCheckOutService.getUnitDetails({unitId: this.checkOutPayload.home}).subscribe((data: any) =>{
      // Resetting the option values to false
      data.checklist.items.length > 0 && data.checklist.items.forEach(item => {
        item.takeover = Object.assign({}, item.handover)
    });
      this.formData = data.checklist;
      this.emptyForm = data.checklist.items.length === 0 ? true : false ;
  
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

  getChecklistByHome() {
    this.CheckInCheckOutService.getChecklistByHome(this.checkOutPayload.home).subscribe(
      (data: any) => {
        if (data.checkOutTermAndCondition.length > 0) {
          this.terms = data.checkOutTermAndCondition;
        }
      },
      (err) => {
        console.log("Error", err);
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
  
    });

    return modal.present();
  }

  async navigateToSummary() {

    console.log(this.formData,this.checkOutPayload.home);

    this.checkOutPayload.items = this.formData.items;
 
    const modal = await this.modalCtrl.create({
      component: ChecklistSummaryComponent,
      cssClass: 'full-modal',
      componentProps: {
        checkInPayload: this.checkOutPayload,
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
      console.log(data);
    });

    return modal.present();
  }

  checkValidation(): boolean {
    return (
      this.formData &&
      this.formData.items &&
      this.terms.length === this.termCheckboxes.length &&
      this.termCheckboxes.every((value) => value === true) &&
      this.formData.items.every((item) => item.options.some((option) => option.selected)
      )
  )
  }
}
