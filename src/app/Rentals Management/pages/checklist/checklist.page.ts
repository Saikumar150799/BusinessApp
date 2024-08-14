import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx'
import { ActionSheetController, Events, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { SignaturePadComponent } from '../../components/signature-pad/signature-pad.component';
import { ChecklistDropDownComponent } from '../../components/checklist-drop-down/checklist-drop-down.component';
import { TicketService } from '../../services/ticket.service';
import { SuccessAlertModalComponent } from '../../modals/success-alert-modal/success-alert-modal.component';
import { HttpClient } from '@angular/common/http';
import { GoogleService } from 'src/app/google.service';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  public sections: Array<any> = [];
  public section:any ;
  public ticket: any = {};
  public selected: any;
  public selectedDropDownOption: any = {};
  public index: number = 0;
  public showCompletionSection: boolean = false;
  public disableInfiniteScroll: boolean = false;
  public showLoading: boolean = false;
  public paginatedCheckList = [];
  public completionForm: any = {
    files: [],
    signature : '',
    enabled: true
    

  };
  public location: any = {};
  private loadingInstence: HTMLIonLoadingElement;
  public images: any[] = [];
  public files: any[] = [];
  public  loading: boolean = false;
  public date: any;
  public showDoneButton: boolean = false;
  public isButtonAvailable: boolean = false;
  public feildTypes = ['text', 'textarea', 'date', 'time'];
  public emptySection: boolean = false;
  public filterData: any = {
    page: 0,
    limit: 15
  };
  constructor(
    public transService: translateService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private geolocation: Geolocation ,
    private nativeGeocoder: NativeGeocoder,
    private loadingCtrl: LoadingController,
    private alertService: AlertServiceService,
    private actionSheet: ActionSheetController,
    public webView: WebView,
    private modalController: ModalController,
    private router: Router,
    private popoverCtrl: PopoverController,
    private ticketService: TicketService,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient,
    private googleService: GoogleService,
    public events: Events,
  ) { 

    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.index = params.params.index ? JSON.parse(params.params.index) : 0;
      this.ticket = this.dataService.getData();
      this.sections = this.ticket.checklist.checklistSections ? this.ticket.checklist.checklistSections : [] ;
      this.getSection();
    });

    this.completionForm.name = `${window.localStorage.getItem('firstName') || ""} ${ window.localStorage.getItem('lastName') || ""}`;
    this.completionForm.countryCode = window.localStorage.getItem('countryCode');
    this.completionForm.phoneNumber = window.localStorage.getItem('phoneNumber');


  }

  ngOnInit() {
    this.completionForm.date = new Date().toISOString();
    this.completionForm.time = new Date().toISOString();
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }

  async getSection(){
    console.log("SECTIONS",this.sections);
    this.section = this.sections[this.index];

    this.loadMore(null);
    this.emptySection = this.section && this.section.checklistItems == 0 ? true : false;
    this.handleChange(this.section.checklistItems);
  }

  async loadMore(event) {
    if (!event) {
      this.showLoading = true;
    }
    setTimeout(() => {
      const startIndex = this.filterData.page * this.filterData.limit;
      const endIndex = startIndex + this.filterData.limit;
      this.paginatedCheckList = this.paginatedCheckList.concat(
        this.section.checklistItems.slice(startIndex, endIndex)
      );
      this.filterData.page++;
      event && event.target
        ? event.target.complete()
        : this.showLoading = false;

      if (this.paginatedCheckList.length === this.section.checklistItems.length) {
        this.disableInfiniteScroll = true;
      }
    }, 500);
  }

  async openSignaturePad(){
    const modal = await this.modalController.create({
      component: SignaturePadComponent,
      cssClass: 'full-modal'
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data && data.role === 'true') {
        this.completionForm.files = data.data.files;
        this.completionForm.signature = data.data.signatureImage;
        console.log("compleee",this.completionForm);
      }
    });
    return await modal.present();
  }

  handleRadioChange(selectedOption: any, options): void {
    options.forEach(option => {
      option.selected = option._id === selectedOption._id;
    });
    this.handleChange(this.section.checklistItems);
  }
  
  checkSelected(item){
    const selectedOption = item.options.find(option => option.selected );
    return selectedOption ? selectedOption._id : '';

  }

  handleChange(checklistItems){
    let array = [];
    const manditoryFeilds = checklistItems.filter(item => item.isMandatory);
    if(manditoryFeilds.length > 0){
      this.isButtonAvailable = manditoryFeilds.every((field) => {
        if(this.feildTypes.includes(field.fieldType)){
          array.push(field);
          return array.every(field => field.fieldValue);
        }else{
          return field.options.some(option => option.selected);
        }
        
      });
    }else{
      this.isButtonAvailable = true;
    }
      if(this.isButtonAvailable){

        this.checkMediaCompletion(checklistItems);
      }
  }

  checkMediaCompletion(checklistItems) {
    let result;
    const manditoryFeilds = checklistItems.filter((item) =>{
      if(item.imageRequired || item.noteRequired){
        return item.imageRequired.isMandatory || item.noteRequired.isMandatory
      }
    });
    this.isButtonAvailable = manditoryFeilds.every((field) => {
      if(field.imageRequired.isMandatory && field.noteRequired.isMandatory){
        return field.files.length > 0 && field.note && field.note.trim().length > 0;
      }

      if(field.imageRequired.isMandatory ){
        return field.files.length > 0 ;
      }
      
      if(field.noteRequired.isMandatory){
        return field.note && field.note.trim().length > 0
      }
    });
  }


  public presentDropDownPopover(ev: any,options = {}) {
    this.popoverCtrl.create({
      component: ChecklistDropDownComponent,
      event: ev,
      componentProps: {
        options: options
      }
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
        if (data.role === 'selected') {
          console.log("-----",data);
            // this.selectedDropDownOption = data.data.find(feild => feild.selected == true);
            // const dropDownIndex = this.section.checklistItems.findIndex((feild)=>feild.fieldType === 'dropdown');
            // this.section.checklistItems[dropDownIndex].options = data.data;
            // this.handleChange(this.section.checklistItems);
        }
      })
    })
  }

  getSelected(item){
    // console.log(item.options.find(option => option.selected));
    const selectedOption =  item.options.find(option => option.selected);
    this.handleChange(this.section.checklistItems);
    return selectedOption || {} as any;
  }
  nextSection(){
    console.log("INDEX",this.index,this.sections);
    if(this.index < this.sections.length - 1 ){
      this.index += 1;
      this.section = this.sections[this.index];
      this.emptySection = this.section && this.section.checklistItems == 0 ? true : false;
      this.filterData.page = 0;
      this.paginatedCheckList = [];
      this.loadMore(null);
    }else{
      this.showCompletionSection = this.ticket.checklist.completionSection.enabled;
      if(this.showCompletionSection && (this.index == (this.ticket.checklist.checklistSections.length - 1))){
        this.index += 1;
      }else {
        this.index = this.ticket.checklist.checklistSections.length ;
      }
    }
  }

  prevSection(){
    this.showCompletionSection = false;
    if(this.index > 0){
      this.index -= 1;
      this.section = this.sections[this.index]
      console.log("INDEX AFTER",this.index);
      this.emptySection = this.section && this.section.checklistItems == 0 ? true : false;
      this.filterData.page = 0;
      this.paginatedCheckList = [];
      this.loadMore(null);
    }else{
      this.index = 0;
    }
  }


  async fetchLocation(){
    this.loading = true;
    await this.geolocation.getCurrentPosition().then( async resp => {
      this.location.latitude = resp.coords.latitude;
      this.location.longitude = resp.coords.longitude;
      this.googleService.getAddress(resp.coords.latitude, resp.coords.longitude).subscribe((data: any) =>{
        if (data.status === 'OK') {
          this.location.address = data.results[0].formatted_address;
        } else {
          console.error('Geocoding failed: ', data.status);
        }
        this.loading = false;
      },(err)=>{
        console.log("err",err);
        this.loading = false;
      })
    }, error => {
      this.loading = false;
      console.log('Error getting location', error);
    })
  }

  public presentActionSheet(item) {
    console.log("ITEM");
    this.actionSheet.create({
      header: `${this.transService.getTranslatedData('Select image from')}`,
      buttons: [
        {
          text: `${this.transService.getTranslatedData('Camera')}`,
          icon: 'camera',
          handler: async () => {
            this.fileSourceOption('camera', item);
          }
        },
        {
          text: `${this.transService.getTranslatedData('Library')}`,
          icon: 'images',
          handler: () => {
            this.fileSourceOption('library',item);
          }
        },
        {
          text: `${this.transService.getTranslatedData('Cancel')}`,
          icon: 'close',
          handler: () => {
            console.log('cancel');
          }
        }
      ]
    }).then(actionsheet => {
      actionsheet.present();
    });
  }

  goBack(){
    this.router.navigate(['/checklist'], {
      queryParams: { ticketId: this.ticket._id}
    });
  }

  async fileSourceOption(type: string,item) {
    const caller = await this.alertService.capturePhoto(type);
    if (caller) {
      console.log(caller);
      await this.presentLoading();
      this.alertService.getPutSignedUrl(caller).subscribe((res: any) => {
        this.alertService.s3BucketFileTransfer(caller, res.url).then(() => {
          res.image = this.webView.convertFileSrc(caller);
          item.files.push(res)
          this.handleChange(this.section.checklistItems);
          this.loadingInstence.dismiss();
        }).catch(() => {
          this.loadingInstence.dismiss();
        });
      }, err => {
        this.loadingInstence.dismiss();

      });
    }

  }
  public removeImage(checklistItems, item: any ,img: any) {
    item.files = item.files.filter(image => image._id != img._id);
    this.handleChange(this.section.checklistItems);
    
  }

  markAsDone(){
    this.showDoneButton = true;
  }


  public checkIfButtonAvailable() {
    if(this.section[0].checklistItems){
      this.section[0].checklistItems.forEach((feild)=>{
        console.log("=======",feild);
      })
    }
    // section.checklistItems.forEach((feild)=>{
    //   console.log("====",feild);
    // })
  }

  submitSection(){
    console.log("checklist",this.section);
  }

  updateChecklistSection(action: string){
    console.log("Saving checklist section", this.section)
    const payload = {
      ticketId: this.ticket._id,
      sectionId: this.section._id,
      checklistItems : this.section.checklistItems,
      isSectionUpdate: action === 'draft' ? false : true
    }
    this.presentLoading();
    this.ticketService.updateChecklistSection(payload).subscribe((data: any)=>{
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      },300)
      if (action === "draft") {
        this.routeToTicketDetails();
        this.events.publish('reload:data', 'checkList');
        this.changeDetector.detectChanges();
      } else {
        this.nextSection();
        this.handleChange(this.section.checklistItems);
        if (this.ticket.checklist.checklistSections.length == this.index &&!this.ticket.checklist.completionSection.enabled) {
          this.updateChecklist();
        }else {
          this.events.publish('reload:data', 'checkList');
          this.changeDetector.detectChanges();
        }
      }
    },(err)=>{
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      },300)
      this.alertService.presentAlert('',err.error.message);
      console.log(err);
    })
  }

  updateChecklist(){
    if(this.ticket.checklist.completionSection.enabled){
      this.completionForm.location = this.location;
      this.ticket.checklist.completionSection = Object.assign({}, this.completionForm);
    }
    this.presentLoading();
    this.ticketService.updateCheckList(this.ticket._id,{completionSection : this.ticket.checklist.completionSection}).subscribe((res: any) =>{
      this.loadingCtrl.dismiss();
      this.presentSuccessAlertModal();
      this.routeToTicketDetails();
    },(err)=>{
      console.log(err);
      this.loadingCtrl.dismiss();
      this.alertService.presentAlert('', err.error.message);
    })
  }

  routeToTicketDetails(){
    this.router.navigate(['/rentals-ticket-details'], {
      queryParams: {
        ticketId: this.ticket._id,
        tab: "CHECKLIST"
      }
    })
    this.events.publish('reload:data', 'checkList');
  }

  async presentSuccessAlertModal(){
    let modal = await this.modalController.create({
      component: SuccessAlertModalComponent,
      componentProps: {
        data:{
          reference: 'ticketCheckList'
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

}
