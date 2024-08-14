import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, ActionSheetController } from '@ionic/angular';
import { UnitSearchPage } from '../unit-search/unit-search.page';
import { UserSearchPage } from '../user-search/user-search.page';
import { TicketCategorySearchPage } from '../ticket-category-search/ticket-category-search.page';
import { TicketSubCategorySearchPage } from '../ticket-sub-category-search/ticket-sub-category-search.page';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { StorageService } from 'src/app/common-services/storage-service.service';
import { PictureComponent } from 'src/app/common-components/picture/picture.component';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { TicketFilteProjectSearchComponent } from '../../modals/ticket-filte-project-search/ticket-filte-project-search.component';
import { AssetsSearchPage } from '../assets-search/assets-search.page';
import { FacilitySearchComponent } from '../../modals/facility-search/facility-search.component';
import { TicketFacilitySearchComponent } from '../../modals/ticket-facility-search/ticket-facility-search.component';
import * as _ from 'lodash';
import { HomeSearchPage } from '../home-search/home-search.page';
import { ProjectService } from '../../services/project.service';
import { SingalSelectionComponent } from 'src/app/common-components/singal-selection/singal-selection.component';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.page.html',
  styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {

  ticketData: any = {
    ticketBelongsTo: 'Home',
    priority: 'low',
    agents: [],
    contactPoint: { name: '' },
    assets: [],
    checklist: { name: '' },
  };
  public assetsCount: string = '';

  private loadingInstence: HTMLIonLoadingElement;
  // public AMPM: Array<string> = ["صباحا", "مساء"]
  public images: any[] = [];
  date: Date;
  flag = false;
  subCategories = [];
  ticketId: string;
  flow = 'createTicket';
  title = this.transService.getTranslatedData('Raise ticket');
  files: any[] = [];
  public pocInputValue: string = '';
  public organizationType: string = '';
  public isCheckListUpdate: boolean = false;

  public projectFilterData: {page: number,searchText: string, limit: number} = {
    page: 1,
    searchText: '',
    limit: 15
    };
    public projects = [];

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertServiceService,
    public transService: translateService,
    public webview: WebView,
    private storageService: StorageService,
    private actionSheet: ActionSheetController,
    private appSetting: MainAppSetting,
    private changeDetector: ChangeDetectorRef,
    public projectService: ProjectService
  ) {
    this.date = new Date();
    this.route.queryParamMap.subscribe((params: any) => {
      this.ticketId = params.params.ticketId ? params.params.ticketId : '';
      console.log(this.ticketId);

    });
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }
  ionViewDidEnter() {
    this.flag = false;
  }
  async ngOnInit() {

    await this.storageService.getDatafromIonicStorage('organizationType').then((data) =>{
      this.organizationType = data;
    })

    if (this.ticketId) {
      this.flow = 'editTicket';
      this.title = this.transService.getTranslatedData('Update Ticket');
      this.getTicketDetails();
    } else {


      // this.ticketData.jobStartTime = this.date.toISOString();
      // this.ticketData.jobDate = this.date.toISOString();
      // this.ticketData.jobEndDate = this.date.toISOString();
      // this.ticketData.jobEndTime = new Date(this.date.setDate(this.date.getMinutes() + 30)).toISOString();

      // if (this.date.getMinutes() < 30) {
      //   this.date.setMinutes(30);
      // } else {
      //   this.date.setMinutes(0);
      //   this.date.setHours(new Date().getHours() + 1);
      // }
      // this.ticketData.jobStartTime = this.date.toISOString();;
      // this.date.setMinutes(this.date.getMinutes() + 30);
      // this.ticketData.jobEndTime = this.date.toISOString();
    }
  }

  async searchProjects() {
    this.projectService.getProjects(this.projectFilterData).subscribe(
      (data: any) => {
        this.projects = data.rows;
        if (data.rows.length == 1) {
          this.ticketData.ticketBelongsToName = data.rows[0].name;
          this.ticketData.ticketBelongsToRefId = data.rows[0]._id;
        }
      },
      (err) => {
        console.log("ERROR", err);
        this.alertService.presentAlert(
          "",
          err.error.message || "Something went wrong"
        );
      }
    );
  }

  async getTicketDetails() {
    await this.presentLoading();
    this.ticketService.getTicketById(this.ticketId)
      .subscribe(async (data: any) => {
        this.loadingInstence.dismiss();
        this.ticketData = data;

        if (data.ticketCategory) {
          this.ticketData.ticketCategoryName = data.ticketCategory;
        }

        if (data.ticketSubCategory) {
          this.ticketData.ticketSubCategoryName = data.ticketSubCategory;
        }

        if (data.contactPoint) {
          this.ticketData.contactPoint = data.contactPoint
          if (data.contactPoint.firstName) {
            this.ticketData.contactPointName = data.contactPoint.firstName;
          }
          if (data.contactPoint.lastName) {
            this.ticketData.contactPointName = this.ticketData.contactPointName + ' ' + data.contactPoint.lastName;
          }
          this.ticketData.contactPoint.name = this.ticketData.contactPointName
        } else {
          this.ticketData.contactPoint = { name: '' };
        }

        if(data.contactPoints){
          this.ticketData.contactPoints = await this.getContactPointsIds(data.contactPoints);
          await this.checkSelectedContactPoints();
        }

        if(data.assets && data.assets.length > 0) {
          if (data.assets.length === 1) {
            this.assetsCount = `${data.assets.length.toString()} asset selected`;
          } else {
            this.assetsCount = `${data.assets.length.toString()} assets selected`;
          }
        }

        if (data.agents) {
          this.ticketData.agents = data.agents
          this.ticketData.agents.forEach(agent => {
            let agentName;
            if (agent.firstName) {
              agentName = agent.firstName;
            }
            if (agent.lastName) {
              agentName = agentName + ' ' + agent.lastName;
            }
            agent.name = agentName

          });
        }

        if(data.facility) {
          this.ticketData.ticketBelongsToFacilityName = data.facility.name || '';
        }

        console.log(this.ticketData);
      },
        err => {
          this.loadingInstence.dismiss();
          this.alertService.presentAlert('',
            err.error.error);
        }
      );
  }

  selectTicketBelongsTo(value) {
    this.ticketData.ticketBelongsTo = value;
    this.ticketData.assets = [];
    this.assetsCount = '';
    this.ticketData.listingName = '';

    delete this.ticketData.ticketBelongsToName;
    delete this.ticketData.ticketBelongsToRefId;
    delete this.ticketData.ticketCategoryName;
    delete this.ticketData.ticketCategory;
    delete this.ticketData.ticketCategoryId;
    delete this.ticketData.ticketBelongsToFacilityName;
    delete this.ticketData.ticketSubCategoryName;

    if(value !='Home') {
      this.searchProjects();
      }
  }

  selectPriority(value) {
    this.ticketData.priority = value;
  }

  async openHomeSearchModal() {

    const modal = await this.modalController.create({
      component: HomeSearchPage,
      componentProps: {
        id: this.ticketData.ticketBelongsToRefId,
        name: this.ticketData.ticketBelongsToName
      }
    });

    modal.onDidDismiss().then((home: any) => {
      if (home !== null && home.data) {

        console.log(home);
        delete this.ticketData.ticketCategoryName;
        delete this.ticketData.ticketCategory;
        delete this.ticketData.ticketCategoryId;
        this.ticketData.ticketBelongsToName = home.data.ticketBelongsToName;
        this.ticketData.ticketBelongsToRefId = home.data.ticketBelongsToRefId;
        console.log(this.ticketData);

      }
    });

    return await modal.present();
  }
  
  async openUnitSearchModal() {

    const modal = await this.modalController.create({
      component: UnitSearchPage,
      componentProps: {
        id: this.ticketData.listings,
        name: this.ticketData.listingName,
        ticketBelongsTo: 'home',
        homeId: this.ticketData.ticketBelongsToRefId
      }
    });

    modal.onDidDismiss().then((unit: any) => {
      if (unit !== null && unit.data) {
        console.log("================================",unit)

        this.ticketData.listingName = unit.data.listingName;

        if (this.organizationType === "residential") {
          this.ticketData.ticketBelongsToRefId = unit.data.ticketBelongsToRefId;
        } else {
          this.ticketData.listings = unit.data.listings;
        }

      }
    });

    return await modal.present();
  }

  async openChecklistModal() {

    const modal = await this.modalController.create({
      component: SingalSelectionComponent,
      componentProps: {
        headerTitle: 'Checklist',
        type: 'checklist',
        selected: this.ticketData.checklist,
      }
    })
    modal.onDidDismiss().then((data) => {
      if(!_.isEmpty(data.data)){
        this.tagChecklist(data.data);
        this.isCheckListUpdate = true;
      }
    })
    return modal.present();
  }

  async openAssetsSearchModal () {
    
    const modal = await this.modalController.create({
      component: AssetsSearchPage,
      componentProps: {
        data: {
          ticketData: this.ticketData,
        }},
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data && data.data.assets.length > 0) {
        this.ticketData.assets = data.data.assets;
        if (data.data.assets.length === 1) {
          this.assetsCount = `${data.data.assets.length.toString()} asset selected`;
        } else {
          this.assetsCount = `${data.data.assets.length.toString()} assets selected`;
        }
      }
    })

    if (this.ticketData.ticketBelongsToRefId) {
      return await modal.present();
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Select a unit/project'));
    }
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: TicketFilteProjectSearchComponent,
      componentProps: {
        id: this.ticketData.ticketBelongsToRefId,
        name: this.ticketData.ticketBelongsToName
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        delete this.ticketData.ticketCategoryName;
        delete this.ticketData.ticketCategory;
        delete this.ticketData.ticketCategoryId;
        this.ticketData.ticketBelongsToName = project.data.ticketBelongsToName;
        this.ticketData.ticketBelongsToRefId = project.data.ticketBelongsToRefId;
        this.ticketData.assets = [];
        this.assetsCount = '';
        this.ticketData.ticketBelongsToFacilityName = '';
        this.ticketData.facility =  {};
        console.log(this.ticketData);
      }
    });

    return await modal.present();
  }

  async openFacilitySearchModal() {

    const modal = await this.modalController.create({
      component: TicketFacilitySearchComponent,
      componentProps : {
        projectId: this.ticketData.ticketBelongsToRefId,
        facilityId: this.ticketData.facility,
        facilityName: this.ticketData.ticketBelongsToName
      }
    })

    modal.onDidDismiss().then((data: any) => {
      if(!_.isEmpty(data.data) && !_.isEmpty(data.data.facility)) {
        this.ticketData.facility = data.data.facility;
        this.ticketData.ticketBelongsToFacilityName = data.data.facility.name;
      }
    })

    if (this.ticketData.ticketBelongsToRefId) {
      return await modal.present();
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Select a project'));
    }
  }

  async openUserSearchModal(type) {

    var persons: any = [];

    if (type === 'agent') {
      persons = this.ticketData.agents ? JSON.parse(JSON.stringify(this.ticketData.agents)) : [];
      // name = this.ticketData.agentName;
    } else if (type === 'poc') {
      if(this.ticketData.contactPoints){
        persons = this.ticketData.contactPoints;
      }else{
        persons = this.ticketData.contactPoint === undefined ? [] : this.ticketData.contactPoint;
      }
      // name = this.ticketData.contactPointName;
    }
    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        persons,
        type,
        ticketData: this.ticketData,
        // id,
        // name
      }
    });

    modal.onDidDismiss().then((user) => {
      let isDuplicate: boolean;
      if (user !== null && user.data) {
        console.log(user.data);

        if (type === 'agent') {
          isDuplicate = this.checkForDuplicateAgent(user.data)
          // this.ticketData.agentName = user.data.name;
          if (isDuplicate) {
            this.alertService.presentAlert('',
              this.transService.getTranslatedData('Duplicate technician selected'));
          } else {
            this.ticketData.agents = user.data;
          }
        } else if (type === 'poc') {
          // this.ticketData.contactPointName = user.data[0].name;
          this.ticketData.contactPoints = user.data;
          this.checkSelectedContactPoints();
        }
      }
    });

    return await modal.present();
  }

  async openTicketCategorySearchModal() {

    const modal = await this.modalController.create({
      component: TicketCategorySearchPage,
      componentProps: {
        ticketBelongsTo: this.ticketData.ticketBelongsTo === 'Facility' ? 'Project' : this.ticketData.ticketBelongsTo,
        ticketBelongsToRefId: this.ticketData.ticketBelongsToRefId,
        name: this.ticketData.ticketCategoryName,
        ticketCategory: this.ticketData.ticketCategory,
        ticketCategoryId: this.ticketData.ticketCategoryId,
        subCategories: this.subCategories
      }
    });

    modal.onDidDismiss().then((category) => {
      if (category !== null && category.data) {

        console.log(this.ticketData);

        this.ticketData.ticketCategoryName = category.data.name;
        this.ticketData.ticketCategory = category.data.ticketCategory;
        this.ticketData.ticketCategoryId = category.data.ticketCategory;
        delete this.ticketData.ticketSubCategory;
        delete this.ticketData.ticketSubCategoryName;
        delete this.ticketData.ticketSubCategoryId;
        this.subCategories = category.data.subCategory;

        console.log(this.subCategories);
        this.getContactPoints();
      }
    });

    if (this.ticketData.ticketBelongsToRefId) {
      return await modal.present();
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Select a unit/project'));
    }
  }

  async openTicketSubCategorySearchModal() {

    const modal = await this.modalController.create({
      component: TicketSubCategorySearchPage,
      componentProps: {
        subCategories: this.subCategories,
        name: this.ticketData.ticketSubCategoryName,
        ticketSubCategory: this.ticketData.ticketSubCategory
      }
    });

    modal.onDidDismiss().then((subCategory) => {
      if (subCategory !== null && subCategory.data) {
        console.log(subCategory);
        this.ticketData.ticketSubCategoryName = subCategory.data.name;
        this.ticketData.ticketSubCategory = subCategory.data.ticketSubCategory;
        this.ticketData.ticketSubCategoryId = subCategory.data.ticketSubCategory;
        this.getContactPoints();
      }
    });

    if (this.ticketData.ticketCategory) {
      return await modal.present();
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Select a category first'));
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  openModal(value) {
    // Uncomment to limit the number of technician to 2
    // if(this.ticketData && this.ticketData.agents.length === 2 && value === 'agent'){
    //   return
    // }else{
    if (value === 'Home') {
      this.openHomeSearchModal();
    }else if (value === 'Unit') {
      this.openUnitSearchModal();
    } else if (value === 'Project') {
      this.openProjectSearchModal();
    } else if (value === 'agent') {
      this.openUserSearchModal('agent');
    } else if (value === 'poc') {
      this.openUserSearchModal('poc');
    } else if (value === 'ticketCategory') {
      this.openTicketCategorySearchModal();
    } else if (value === 'ticketSubCategory') {
      this.openTicketSubCategorySearchModal();
    } else if (value === 'assets') {
      this.openAssetsSearchModal();
    } else if (value === 'checklist') {
      this.openChecklistModal();
    }
  }

  getContactPoints(){
    const {ticketBelongsTo = '',  ticketBelongsToRefId = '', ticketCategoryId = '', ticketSubCategoryId = ''} = this.ticketData;
    const pocFilter = {
      ticketBelongsTo: ticketBelongsTo === 'Facility' ? 'Project' : ticketBelongsTo,
      ticketBelongsToRefId: ticketBelongsToRefId,
      ticketCategory: ticketCategoryId,
      ticketSubCategory:  ticketSubCategoryId
    }

    this.ticketService.getPointOfContacts(pocFilter).subscribe(async (data: any)=>{
      if(data.contactPoints.length > 0){
        this.ticketData.contactPoints = data.contactPoints || [] ;
      }
      this.checkSelectedContactPoints();
    },(err)=>{
      console.log("ERROR",err);
      this.alertService.presentAlert("",err.error.message);

    })

  }

  tagChecklist(checklist) {
    let {
      _id,
      name,
      description,
      isChecklistMandatoryForTicket,
      checklistSections,
      completionSection,
    } = checklist;

    this.ticketData.checklist = {
      checkListId: _id,
      name,
      description: description || "",
      isChecklistMandatoryForTicket,
      checklistSections,
      completionSection,
    };
  }

  public checkSelectedContactPoints = () =>{
    if(this.ticketData.contactPoints){
      if(this.ticketData.contactPoints.length === 0){
        this.pocInputValue = '';
      }else if(this.ticketData.contactPoints.length === 1){
        this.pocInputValue = '1 Poc selected';
      }else{
        this.pocInputValue = `${this.ticketData.contactPoints.length} Poc's selected`;
      }
    }
    return this.pocInputValue
  }

  async getContactPointsIds(persons){
    return persons.map(person => person._id);
  }




  async raiseTicket() {

    if(this.ticketData.ticketBelongsTo === 'Facility') {
      this.ticketData.ticketBelongsTo = "Project";
      this.ticketData.ticketTagTo = "Facility";
      this.ticketData.facility =  this.ticketData.facility._id;
    }else {
      delete this.ticketData.facility;
      delete this.ticketData.ticketTagTo;
      this.ticketData.ticketBelongsTo = this.ticketData.ticketBelongsTo;
    }

    let newTicketData = JSON.parse(JSON.stringify(this.ticketData));
    if (newTicketData.agents.length > 0) {
      newTicketData.agents = newTicketData.agents.map(agnt => agnt._id)
    }
    if (newTicketData.contactPoints) {
      newTicketData.contactPoints = newTicketData.contactPoints;
    }
    if (this.images.length > 0) {
      newTicketData.files = this.files;
    }

    if(!newTicketData.checklist.checkListId) {
      delete newTicketData.checklist;
    }

    if (newTicketData.assets.length > 0) {
      newTicketData.assets = newTicketData.assets.map((asset) => asset._id);
    }
    await this.presentLoading();
    await this.storageService.getDatafromIonicStorage('user_id').then(val => {
      newTicketData.raisedBy = val;
      newTicketData.createdBy = val;
    });

    delete newTicketData.contactPoint;
    
    console.log(newTicketData);
    this.ticketService.createTicket(newTicketData)
      .subscribe((data: any) => {
        console.log(newTicketData);

        this.loadingInstence.dismiss();
        this.alertService.presentAlert('',
          this.transService.getTranslatedData('Ticket Created'));
        this.router.navigateByUrl(`/rentals-tickets`, { replaceUrl: true });
      },
        err => {
          this.loadingInstence.dismiss();
          this.alertService.presentAlert('', err.error.error);
        }
      );
  }

  async updateTicket() {
    let newTicketData = JSON.parse(JSON.stringify(this.ticketData));
    newTicketData.raisedBy = newTicketData.raisedBy._id;
    if (newTicketData.contactPoint && newTicketData.contactPoint._id) {
      newTicketData.contactPoint = newTicketData.contactPoint._id;
    } else {
      delete newTicketData.contactPoint;
    }

    if(newTicketData.contactPoints){
      newTicketData.contactPoints = newTicketData.contactPoints
    }else{
      delete newTicketData.contactPoints;
    }
    if (newTicketData.agents.length > 0) {
      newTicketData.agents = newTicketData.agents.map(agent => agent._id)
    }
    if (newTicketData.ticketCategory) {
      newTicketData.ticketCategory = newTicketData.ticketCategoryId;
    }

    if (newTicketData.ticketSubCategory) {
      newTicketData.ticketSubCategory = newTicketData.ticketSubCategoryId;
    }
    if (newTicketData.assets.length > 0) {
      newTicketData.assets = newTicketData.assets.map(ele => ele._id);
    }

    if (this.images.length > 0) {
      newTicketData.files = newTicketData.files.concat(this.files);
    }
    if (newTicketData.estimates.length > 0) {
      newTicketData.estimates = newTicketData.estimates.map(estimate => estimate._id)
    }

    if(!_.isEmpty( newTicketData.facility )) {
      newTicketData.facility = newTicketData.facility._id;
    }
    await this.presentLoading();
    console.log(newTicketData);

    this.ticketService.updateTicket(newTicketData)
      .subscribe((data: any) => {
        this.loadingInstence.dismiss();
        this.alertService.presentAlert('',
          this.transService.getTranslatedData('Ticket Updated'));
        this.flag = true;
        const tab = this.isCheckListUpdate ? `&tab=CHECKLIST` : "";
        this.router.navigateByUrl(`/rentals-ticket-details?flag=${this.flag}&ticketId=${this.ticketData._id}${tab}`);
        // this.router.navigateByUrl('/rentals-ticket-details');
      },
        err => {
          this.loadingInstence.dismiss();
          this.alertService.presentAlert('',
            err.error.message || "Something went wrong");
        }
      );
  }


  async fileSourceOption(type: string) {
    const caller = await this.alertService.capturePhoto(type);
    if (caller) {
      console.log(caller);
      await this.presentLoading();
      this.images.push(caller);
      this.alertService.getPutSignedUrl(caller).subscribe(res => {
        console.log(res);
        this.alertService.s3BucketFileTransfer(caller, res.url).then(() => {
          this.files.push(res);

          this.loadingInstence.dismiss();

        }).catch(() => {

          this.loadingInstence.dismiss();

        });
      }, err => {

        this.loadingInstence.dismiss();

      });
      this.changeDetector.detectChanges();
    }
  }
  remove(agt) {
    this.ticketData.agents = this.ticketData.agents.filter((agent) => agent._id !== agt._id)
    this.changeDetector.detectChanges();
  }

  checkForDuplicateAgent(users) {

    let valueArr = users.map(user => user._id);
    let isDuplicate = valueArr.some((item, idx) => {
      return valueArr.indexOf(item) != idx
    });
    return isDuplicate;
  }


  removeImage(index: number) {
    this.images = this.images.filter((image, i) => i !== index);
    this.files = this.files.filter((file, i) => i !== index);
  }

  public openImage(image: string) {
    this.modalController.create({
      component: PictureComponent,
      componentProps: { image }
    }).then(modal => {
      modal.present();
    });
  }

  public presentActionSheet() {
    this.actionSheet.create({
      header: `${this.transService.getTranslatedData('Select image from')}`,
      buttons: [
        {
          text: `${this.transService.getTranslatedData('Camera')}`,
          icon: 'camera',
          handler: async () => {
            this.fileSourceOption('camera');
          }
        },
        {
          text: `${this.transService.getTranslatedData('Library')}`,
          icon: 'images',
          handler: () => {
            this.fileSourceOption('library');
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


}
