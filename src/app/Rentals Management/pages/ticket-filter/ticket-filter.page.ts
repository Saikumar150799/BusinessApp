import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { UserSearchPage } from '../../pages/user-search/user-search.page';
import * as _ from 'lodash';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TicketService } from '../../services/ticket.service';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { TicketFilteProjectSearchComponent } from '../../modals/ticket-filte-project-search/ticket-filte-project-search.component';
import { UnitSearchPage } from '../unit-search/unit-search.page';
import { TicketCategorySearchPage } from '../ticket-category-search/ticket-category-search.page';
import { TicketSubCategorySearchPage } from '../ticket-sub-category-search/ticket-sub-category-search.page';
import { HomeSearchPage } from '../home-search/home-search.page';
import { StorageService } from 'src/app/common-services/storage-service.service';

@Component({
  selector: 'app-ticket-filter',
  templateUrl: './ticket-filter.page.html',
  styleUrls: ['./ticket-filter.page.scss'],
})
export class TicketFilterPage implements OnInit {
  @Input() subCategories = [];
  @Input() showFutureTickets;
  ticketFilter: any = {
    status: ['open', 'in-progress','re-open','on-hold'],
    ticketBelongsTo: ['Home','Project','Facility'],
    type: ['on-demand'],
    priority: ['low', 'medium', 'high'],
    projectId: ''
  };
  createdBySearchValue: string = '';
  contactPointSearchValue:string = '';
  selectedTab;
  public organizationType: string = '';
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public transService: translateService,
    private alertService: AlertServiceService,
    private barcodeScanner: BarcodeScanner,
    private ticketService: TicketService,
    private alertCtrl: AlertController,
    public appSetting: MainAppSetting,
    public storageService: StorageService
  ) {
    this.selectedTab = this.navParams.get('selectedTab');
    if(this.selectedTab=='ppm'){
     this.ticketFilter.type=['ppm']
    }
    if(this.selectedTab=='automated'){
      this.ticketFilter.type=['automated']
     }
    if (this.navParams.get('data')) {
      this.ticketFilter = this.navParams.get('data');
    }

    if(this.ticketFilter.createdBy){
      if (this.ticketFilter.createdBy.length === 1) {
        this.createdBySearchValue = "1 user selected";
      } else if (this.ticketFilter.createdBy.length === 0) {
        this.createdBySearchValue = "";
      } else if (this.ticketFilter.createdBy.length > 1) {
        this.createdBySearchValue = `${this.ticketFilter.createdBy.length} users selected`;
      }
    }
    
    if(this.ticketFilter.contactPoint){
      if (this.ticketFilter.contactPoint.length === 1) {
        this.contactPointSearchValue = "1 user selected";
      } else if (this.ticketFilter.contactPoint.length === 0) {
        this.contactPointSearchValue = "";
      } else if (this.ticketFilter.contactPoint.length > 1) {
        this.contactPointSearchValue = `${this.ticketFilter.contactPoint.length} users selected`;
      }  
    }
  }

  async ngOnInit() {
    await this.storageService.getDatafromIonicStorage('organizationType').then((data) =>{
      this.organizationType = data;
    })
    
    await this.storageService.getDatafromIonicStorage('ticketFilter').then((data) =>{
      if(data) {
        if(data.status) {
          this.ticketFilter.status = data.status;
        }
        if(data.ticketBelongsTo) {
          this.ticketFilter.ticketBelongsTo = data.ticketBelongsTo;
        }
        if(data.priority) {
          this.ticketFilter.priority = data.priority;
        }
      }
    })
  }

  selectTicketStatus(value) {
    this.ticketFilter.status.indexOf(value) === -1 ? this.ticketFilter.status.push(value) : this.ticketFilter.status.splice(this.ticketFilter.status.indexOf(value), 1);
    // this.ticketFilter.status = _.union([value], this.ticketFilter.status);
    console.log(this.ticketFilter.status);
  }

  selectTicketBelongsTo(value) {
    this.ticketFilter.ticketBelongsTo.indexOf(value) === -1 ? this.ticketFilter.ticketBelongsTo.push(value) : this.ticketFilter.ticketBelongsTo.splice(this.ticketFilter.ticketBelongsTo.indexOf(value), 1);
    console.log(this.ticketFilter.ticketBelongsTo);
    if (!this.ticketFilter.ticketBelongsTo.includes('Home')) {
      delete this.ticketFilter.unitName;
      delete this.ticketFilter.unitId;
    }
  }

  selectTicketType(value) {
    this.ticketFilter.type = value;
  }

  async toggleChanged(event: CustomEvent) {
    if(this.ticketFilter.startDate) {
      delete this.ticketFilter.startDate
    }

    if(this.ticketFilter.endDate) {
      delete this.ticketFilter.endDate;
    }
  }

  selectTicketPriority(value) {
    this.ticketFilter.priority.indexOf(value) === -1 ? this.ticketFilter.priority.push(value) : this.ticketFilter.priority.splice(this.ticketFilter.priority.indexOf(value), 1);
    console.log(this.ticketFilter.priority);
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: TicketFilteProjectSearchComponent,
      componentProps: {
        id: this.ticketFilter.projectId,
        name: this.ticketFilter.projectName
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        this.ticketFilter.projectName = project.data.ticketBelongsToName;
        this.ticketFilter.projectId = project.data.ticketBelongsToRefId;
        delete this.ticketFilter.unitName;
        delete this.ticketFilter.unitId;
      }
    });

    return await modal.present();
  }

  async openHomeSearchModal() {

    const modal = await this.modalController.create({
      component: HomeSearchPage,
      componentProps: {
        id: this.ticketFilter.unitId,
        name: this.ticketFilter.unitName,
        projectId: this.ticketFilter.projectId
      }
    });

    modal.onDidDismiss().then((home: any) => {
      if (home !== null && home.data) {

        console.log(home);
        this.ticketFilter.unitName = home.data.ticketBelongsToName;
        this.ticketFilter.unitId = home.data.ticketBelongsToRefId;
        console.log(this.ticketFilter);

      }
    });

    return await modal.present();
  }

  async openUnitSearchModal() {
    this.modalController.create({
      component: UnitSearchPage,
      componentProps: {
        id: this.ticketFilter.unitId,
        name: this.ticketFilter.unitName,
        homeId: this.ticketFilter.ticketBelongsToRefId
      }
    }).then(modal => {
      modal.present();

      modal.onDidDismiss().then((unit: any) => {
        if (unit !== null && unit.data) {
          this.ticketFilter.unitName = unit.data.listingName;
          this.ticketFilter.unitId = unit.data.listings;
        }
      });
    });
  }

  async openUserSearchModal(type) {

    let id;
    let name;
    let persons = [];

    if (type === 'agent') {
      id = this.ticketFilter.agent;
      name = this.ticketFilter.agentName;
      persons = this.ticketFilter.agent ? [this.ticketFilter.agent] : [];
    } else if (type === 'poc') {
      id = this.ticketFilter.contactPoint;
      persons = this.ticketFilter.contactPoint ? this.ticketFilter.contactPoint : [];
    } else if (type === 'createdBy') {
      id = this.ticketFilter.createdBy;
      persons = this.ticketFilter.createdBy ? this.ticketFilter.createdBy : [];
    }

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        id,
        type,
        persons
      }
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        if (type === 'agent') {
          this.ticketFilter.agentName = user.data[0].name;
          this.ticketFilter.agent = user.data[0]._id;

        } else if (type === 'poc') {
          this.ticketFilter.contactPoint = user.data;
          if (user.data.length === 1) {
            this.contactPointSearchValue = "1 user selected";
          } else if (user.data.length === 0) {
            this.contactPointSearchValue === "";
          } else {
            this.contactPointSearchValue = `${user.data.length} users selected`;
          }

        } else if (type === 'createdBy') {
          this.ticketFilter.createdBy = user.data;
          if (user.data.length === 1) {
            this.createdBySearchValue = "1 user selected";
          } else if (user.data.length === 0) {
            this.createdBySearchValue === "";
          } else {
            this.createdBySearchValue = `${user.data.length} users selected`;
          }
        }
        console.log(this.ticketFilter);
      }
    });

    return await modal.present();
  }

  async openTicketCategorySearchModal() {

    const modal = await this.modalController.create({
      component: TicketCategorySearchPage,
      componentProps: {
        v2: true,
        ticketBelongsTo: this.ticketFilter.ticketBelongsTo,
        name: this.ticketFilter.ticketCategoryName,
        ticketCategory: this.ticketFilter.ticketCategory,
        ticketCategoryId: this.ticketFilter.ticketCategoryId,
        subCategories: this.subCategories
      }
    });

    modal.onDidDismiss().then((category) => {
      if (category !== null && category.data) {

        console.log(this.ticketFilter);

        this.ticketFilter.ticketCategoryName = category.data.name;
        this.ticketFilter.ticketCategory = category.data.ticketCategory;
        this.ticketFilter.ticketCategoryId = category.data.ticketCategory;
        delete this.ticketFilter.ticketSubCategory;
        delete this.ticketFilter.ticketSubCategoryName;
        delete this.ticketFilter.ticketSubCategoryId;
        this.subCategories = category.data.subCategory;

        console.log(this.subCategories);
      }
    });

    await modal.present();

  }

  async openTicketSubCategorySearchModal() {  

    const modal = await this.modalController.create({
      component: TicketSubCategorySearchPage,
      componentProps: {
        subCategories: this.subCategories,
        name: this.ticketFilter.ticketSubCategoryName,
        ticketSubCategory: this.ticketFilter.ticketSubCategory
      }
    });

    modal.onDidDismiss().then((subCategory) => {
      if (subCategory !== null && subCategory.data) {
        this.ticketFilter.ticketSubCategoryName = subCategory.data.name;
        this.ticketFilter.ticketSubCategory = subCategory.data.ticketSubCategory;
        this.ticketFilter.ticketSubCategoryId = subCategory.data.ticketSubCategory;
      }
    });

    if (this.ticketFilter.ticketCategory) {
      return await modal.present();
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Select a category first'));
    }
  }

  openModal(value) {
    if (value === 'Home') {
      this.openUnitSearchModal();
    } else if(value === 'Contract') {
      this.openHomeSearchModal();
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
    } else if (value === 'createdBy') {
      this.openUserSearchModal('createdBy');
    }
  }

  applyFilter() {
    console.log(this.ticketFilter);
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      this.ticketFilter.subCategoryData = this.subCategories;
      this.ticketFilter.showFutureTickets = this.showFutureTickets;
      await this.modalController.dismiss(this.ticketFilter);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  async openScanner() {
    // Scann QR Code.'
    this.barcodeScanner.scan().then(async (barcodeData) => {
      const { text } = barcodeData;
      if (!text) {
        return this.alertService.presentAlert('', 'Invalid barcode');
      }
      this.ticketService.searchAssert(text)
        .subscribe(async (data: any) => {
          const scannedData = data.rows[0];
          data.rows.length > 0 ?
            await this.displayAssetAlert(data, scannedData) :
            this.alertService.presentAlert('', 'Asset not found')

        },
          err => {
            this.alertService.presentAlert('', err.error.message);
          }
        );
    });
  }

  private async displayAssetAlert(data: any, scannedData: any) {
    await this.alertCtrl.create({
      header: data.name,
      message: `
      <b>${this.transService.getTranslatedData('Asset Id')}: </b>${scannedData.assetId ? scannedData.assetId : ''}<br/>

      <b>${this.transService.getTranslatedData('Category')}: </b> ${scannedData.category ? scannedData.category : ''}<br/>

      <b>${this.transService.getTranslatedData('Location')}: </b> ${scannedData.location ? scannedData.location : ''}<br/>

      <b>${this.transService.getTranslatedData('Floor')}: </b> ${scannedData.floor ? scannedData.floor : ''}<br/>

      <b>${this.transService.getTranslatedData('Description')}: </b> ${scannedData.description ? scannedData.description : ''}`,
      buttons: [
        {
          text: 'Scan Again',
          role: 'cancel',
          handler: () => {
            this.openScanner();
          }
        },
        {
          text: 'Confirm',
          role: 'ok',
          handler: () => {
            this.ticketFilter.asset = scannedData._id;
            this.ticketFilter.assetId = scannedData.assetId;
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  public resetFilter(): void {
    this.ticketFilter = {
      status: ['open', 'in-progress','re-open','on-hold'],
      ticketBelongsTo: ['Home','Project','Facility'],
      type: this.selectedTab=='ppm'? ['ppm'] : this.selectedTab=='automated'? ['automated'] : ['on-demand'],
      priority: ['low', 'medium', 'high']
    };
    this.subCategories = [];
    this.contactPointSearchValue = '';
    this.createdBySearchValue = '';
    this.showFutureTickets = false;
  }


  public removeData(event: Event, filterType: string) {
    event.preventDefault();
    event.stopPropagation();

    switch (filterType) {
      case 'Project':
        delete this.ticketFilter.projectName;
        delete this.ticketFilter.projectId;
        delete this.ticketFilter.unitName;
        delete this.ticketFilter.unitId;
        break;

      case 'Home':
        delete this.ticketFilter.unitName;
        delete this.ticketFilter.unitId;
        break;
      case 'POC':
        delete this.ticketFilter.contactPoint;
        this.contactPointSearchValue = '';
        break;
      case 'Technician':
        delete this.ticketFilter.agent;
        delete this.ticketFilter.agentName;
        break;

      case 'Asset':
        delete this.ticketFilter.asset;
        delete this.ticketFilter.assetId;
        break;

      case 'createdBy':
        delete this.ticketFilter.createdBy;
        this.createdBySearchValue = '';
        break;

      default:
        console.log("No data Removed");

        console.log(this.ticketFilter);
        break;

    }
  }

}
