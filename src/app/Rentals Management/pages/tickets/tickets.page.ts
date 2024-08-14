import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { IonInfiniteScroll, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { TicketFilterPage } from '../../pages/ticket-filter/ticket-filter.page';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { StorageService } from 'src/app/common-services/storage-service.service';
import { TicketSortComponent } from '../../modals/ticket-sort/ticket-sort.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  tickets: any[] = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public noTicket = false;
  public showActiveUserTicket: boolean = false;
  public togglePlaceholder: string = 'Show Tickets';
  public toggleChangeTrigger: boolean = true;
  public pullToRefresh: boolean = false;
  filterData: any = {
    page: 1,
    searchText: '',
    limit: 10,
    status: ['open', 'in-progress','re-open','on-hold'],
    ticketBelongsTo: ['Home','Project','Facility'],
    type: ['on-demand'],
    priority: ['low', 'medium', 'high'],
    sort: ['-createdAt',]
  };
  public interfaceOptions: any = {
    cssClass: 'ticket-search-popover',
  };

  public showFutureTickets = false;
  public showSpinner = false;
  public dataFromFilterPage: any;
  public subCategoryFromFilterPage: any[] = [];
  public status = '';
  public ticketBelongsTo = '';
  public type = '';
  public priority = '';
  private loadingInstance: HTMLIonLoadingElement;
  private apiSubs: any;
  selectedTab =  'on-demand';
  constructor(
    private ticketService: TicketService,
    private ref: ChangeDetectorRef,
    private loading: LoadingController,
    private modalController: ModalController,
    private alertService: AlertServiceService,
    private popOverCtrl: PopoverController,
    public transService: translateService,
    private route: ActivatedRoute,
    public storageService: StorageService,
    private router: Router,
    public changeDetector: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      
      this.selectedTab = params && params.type || this.selectedTab;
      this.filterData.type =  params && params.type ? [params.type] : this.filterData.type;

      if (this.selectedTab === "ppm") {
        this.filterData.sort.splice(0, 1, "-jobDate,-jobStartTime");
        this.togglePlaceholder = "Show PPM";
      } else {
        this.filterData.sort.splice(0, 1, "-createdAt");
      }

      if (params && params.id) {
        this.filterData.asset = `&asset=${params.id}`;
        this.filterData.status = this.filterData.status.concat(['resolved', 'rejected']);
        this.filterData.type = ['on-demand'];
        this.dataFromFilterPage = {
          status: ['open', 'in-progress', 'rejected', 'resolved'],
          ticketBelongsTo: ['Home'],
          type: ['on-demand'],
          priority: ['low', 'medium', 'high'],
        };
      }
    });
  }
  async ngOnInit() {
    this.filterData.page = 1;
    this.tickets = [];
    this.infiniteScroll.disabled = true;
    this.noTicket = false;

    await this.storageService.getDatafromIonicStorage("ticketFilter").then((data) => {
      if(data) {
        if (data.status) {
          this.filterData.status = data.status;
        }
        if (data.ticketBelongsTo) {
          this.filterData.ticketBelongsTo = data.ticketBelongsTo;
        }
        if (data.priority) {
          this.filterData.priority = data.priority;
        }
      }

      this.fetchTickets("");
    });

  }

  ionViewDidEnter() {

  }

  async handleRefresh(event) {
    this.noTicket = false;
    this.pullToRefresh = true;
    this.tickets = [];
    this.filterData.page = 1;
    await this.fetchTickets(event);
    this.changeDetector.detectChanges();
  }

  async presentLoading() {
    this.loadingInstance = await this.loading.create({
      spinner: 'lines'
    });
    await this.loadingInstance.present();
  }


  async openTicketFilterModal() {
    this.modalController.create({
      component: TicketFilterPage,
      componentProps: {
        data: this.dataFromFilterPage,
        selectedTab : this.selectedTab,
        subCategories : this.subCategoryFromFilterPage,
        showFutureTickets: this.showFutureTickets
      }
    }).then(modal => {

      modal.onDidDismiss().then( async (ticketFilter: any) => {
        if (ticketFilter !== null && ticketFilter.data) {

          this.dataFromFilterPage = Object.assign({}, ticketFilter.data);

          if(ticketFilter.data.subCategoryData && ticketFilter.data.subCategoryData.length >0){
            this.subCategoryFromFilterPage = ticketFilter.data.subCategoryData;
          }else{
            this.subCategoryFromFilterPage = [];
          }

          if(ticketFilter.data.createdBy){
            this.toggleChangeTrigger = false;         
            this.showActiveUserTicket = false;
            setTimeout(() => {
              this.toggleChangeTrigger = true;
            }, 0);

          }

          this.filterData.categories = ticketFilter.data.ticketCategory || '';
          this.filterData.subCategories = ticketFilter.data.ticketSubCategory || '';

          this.filterData.startDate = ticketFilter.data.startDate ? ticketFilter.data.startDate : '';
          this.filterData.endDate = ticketFilter.data.endDate ? ticketFilter.data.endDate : '';
          this.filterData.projects = ticketFilter.data.projectId ? ticketFilter.data.projectId : '';
          if (ticketFilter.data.ticketBelongsTo.includes('Home')) {
            this.filterData.ticketBelongsToRefId = ticketFilter.data.unitId ? ticketFilter.data.unitId : '';
          } else {
            delete this.filterData.ticketBelongsToRefId;
          }
          this.filterData.agent = ticketFilter.data.agent ? `&agent=${ticketFilter.data.agent}` : this.filterData.agent = '';
          this.filterData.contactPoint = ticketFilter.data.contactPoint ? `&contactPoint=${ticketFilter.data.contactPoint}` : '';

          this.filterData.createdBy = ticketFilter.data.createdBy ? `&createdBy=${ticketFilter.data.createdBy}` : '';

          if (this.showActiveUserTicket && !ticketFilter.data.createdBy) {
            let userId
            await this.alertService.getDataFromLoaclStorage('user_id').then(val => {
              userId = val;
            });
            this.filterData.createdBy = `&createdBy=${userId}`;
          }
          

          if (ticketFilter.data.ticketBelongsTo) {
            this.saveToStorage(ticketFilter.data);
            this.filterData.ticketBelongsTo = ticketFilter.data.ticketBelongsTo;
          }

          if (ticketFilter.data.type) {
            this.filterData.type = ticketFilter.data.type;
          }

          if (ticketFilter.data.priority) {
            this.saveToStorage(ticketFilter.data);
            this.filterData.priority = ticketFilter.data.priority;
          }

          this.showFutureTickets = ticketFilter.data.showFutureTickets;

          if (ticketFilter.data.status) {
            this.saveToStorage(ticketFilter.data);
            this.filterData.status = ticketFilter.data.status;
          }

          if (ticketFilter.data.asset && ticketFilter.data.assetId) {
            this.filterData.asset = `&asset=${ticketFilter.data.asset}`
            this.filterData.assetId = ticketFilter.data.assetId;
          } else {
            this.filterData.asset = '';
            this.filterData.assetId = '';
          }

          if (this.filterData.startDate) {
            this.filterData.startDate = new Date(this.filterData.startDate);
            this.filterData.startDate = new Date(this.filterData.startDate.setHours(0, 0, 0, 0));
            this.filterData.startDate = this.filterData.startDate.toJSON();
          }

          if (this.filterData.startDate && !this.filterData.endDate) {
            const d = new Date(this.filterData.startDate);
            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDate();
            const end = new Date(year + 1, month, day);
            this.filterData.endDate = end.toJSON();
          }

          if (this.filterData.endDate) {
            this.filterData.endDate = new Date(this.filterData.endDate);
            this.filterData.endDate = new Date(this.filterData.endDate.setHours(0, 0, 0, 0));
            this.filterData.endDate = (this.filterData.endDate.toJSON());
          }

          this.tickets = [];
          this.noTicket = false;
          this.filterData.page = 1;
          this.infiniteScroll.disabled = true;
          this.fetchTickets('');

        }
      });

      return modal.present();
    });
  }

  async saveToStorage(data) {

    const { status, priority, ticketBelongsTo } = data;

    const newData = { status, priority, ticketBelongsTo };

    await this.storageService.storeDataToIonicStorage('ticketFilter', newData);
  }

  // skip,
  // status,
  // ticketBelongsTo,
  // type,
  // projects,
  // priority,
  // startDate,
  // endDate,
  // contactPoint,
  // agent,
  // asset

  async fetchTickets(event) {
    this.status = '';
    this.ticketBelongsTo = '';
    this.type = '';
    this.priority = '';
    if (!event) {
      await this.presentLoading();
    }

    await this.filterData.status.forEach(element => {
      // this.status = this.status + `&status=${element}`;  //Gives an empty payload
      this.status = this.filterData.status.indexOf(element) === 0 ? `status=${element}` : this.status + `&status=${element}`;

    });
    await this.filterData.ticketBelongsTo.forEach(element => {
      // this.status = this.status + `&status=${element}`;  //Gives an empty payload
      this.ticketBelongsTo = this.filterData.ticketBelongsTo.indexOf(element) === 0 ? `ticketBelongsTo=${element}` : this.ticketBelongsTo + `&ticketBelongsTo=${element}`;
    });

    await this.filterData.type.forEach(element => {
      // this.status = this.status + `&status=${element}`;  //Gives an empty payload
      this.type = this.filterData.type.indexOf(element) === 0 ? `&type=${element}` : this.type + `&type=${element}`;
    });

    await this.filterData.priority.forEach(element => {
      // this.status = this.status + `&status=${element}`;  //Gives an empty payload
      this.priority = this.filterData.priority.indexOf(element) === 0 ? `&priority=${element}` : this.priority + `&priority=${element}`;
    });

    moment.locale('en');
    // alert(this.status)
    this.apiSubs = this.ticketService.getTickets(
      this.filterData.page || '',
      this.filterData.searchText || '',
      this.status || '',
      this.ticketBelongsTo || '',
      this.type || '',
      this.filterData.projects || '',
      this.priority || '&',
      this.filterData.startDate ? `&startDate=${moment(this.filterData.startDate).format('YYYY-MM-DD')}` : '',
      this.filterData.endDate ? `&endDate=${moment(this.filterData.endDate).format('YYYY-MM-DD')}` : '',
      this.filterData.contactPoint || '',
      this.filterData.agent || '',
      this.filterData.asset || '',
      this.filterData.ticketBelongsToRefId,
      this.filterData.categories || '',
      this.filterData.subCategories || '',
      this.filterData.createdBy || '',
      this.filterData.filterBy && this.filterData.filterBy !== 'All' ? `&filterBy=${this.filterData.filterBy}` : '',
      this.showFutureTickets && this.selectedTab ==='ppm' ? this.showFutureTickets : false,
      this.filterData.sort || [])
      .subscribe((data: any) => {
        if (typeof (event) === "string") {
          this.tickets = data.rows;
        } else {
          this.tickets = this.tickets.concat(data.rows);
        }
        this.noTicket = true;
        this.pullToRefresh = false;
        event && event.target ? event.target.complete() : this.loadingInstance.dismiss();
        this.filterData.page += 1;

        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
        err => {
          console.log(err);
          this.loadingInstance.dismiss();
          this.alertService.presentAlert('',
            err.error.message);
        }, () => {
          this.showSpinner = false;
          this.pullToRefresh = false;
        }
      );
  }
  async popOverOption() {
    const popOver = await this.popOverCtrl.create({
      component: TicketComponent,
      event,
      mode: 'ios'
    });
    return await popOver.present();
  }

  async onTabChange(event){

    this.router.navigate([], {
      queryParams: {
        type: this.selectedTab,
      },
      queryParamsHandling: "merge",
    });
    
    switch (this.selectedTab) {
      case 'on-demand':
        this.togglePlaceholder = 'Show Tickets';
        this.tickets = [];
        this.filterData.page = 1;
        this.infiniteScroll.disabled = true;
        this.noTicket = false;
        this.filterData.type.splice(0,1,'on-demand');
        // this.filterData.ticketBelongsTo = ['Home','Project','Facility']
        // if( this.dataFromFilterPage){
        //   this.dataFromFilterPage.ticketBelongsTo = ['Home','Project','Facility']
        // }
        await this.presentLoading();
        await this.fetchTickets(event)
        break;

        case 'ppm':
        this.togglePlaceholder = 'Show PPM';
        this.tickets = [];
        this.filterData.page = 1;
        this.infiniteScroll.disabled = true;
        this.noTicket = false;
        this.filterData.type.splice(0,1,'ppm');
        // this.filterData.ticketBelongsTo = ['Home','Project','Facility'] // switch the tab to PPM by default get the Home ppm tickets
        // if(this.dataFromFilterPage){
        //   this.dataFromFilterPage.ticketBelongsTo=['Home','Project','Facility']
        // }
        await this.presentLoading();
        await this.fetchTickets(event)
        break;

        case 'automated':
        this.togglePlaceholder = 'Show Automated tickets';
        this.tickets = [];
        this.filterData.page = 1;
        this.infiniteScroll.disabled = true;
        this.noTicket = false;
        this.filterData.type.splice(0,1,'automated');
        // this.filterData.ticketBelongsTo = ['Home','Project','Facility'];
        // if(this.dataFromFilterPage){
        //   this.dataFromFilterPage.ticketBelongsTo=['Home','Project','Facility']
        // }
        await this.presentLoading();
        await this.fetchTickets(event)
        break;
    }
  }

  public openSortFilterModal(){
    this.popOverCtrl.create({
      component: TicketSortComponent,
      componentProps: {
       ticketSort : this.filterData.sort
      },
      event: event,
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then(data => {
        if (data.data === true) {
          this.filterData.sort.splice(0, 1, data.role);
          this.tickets = [];
          this.noTicket = false;
          this.filterData.page = 1;
          this.infiniteScroll.disabled = true;
          this.fetchTickets('');
        }
      })
    })
  }

  public async ticketsBelongsToFilter(value) { 
    this.tickets = [];
    this.filterData.page = 1;
    this.infiniteScroll.disabled = true;
    this.noTicket = false;
    this.fetchTickets('')
  }

  public async searchTickets(event) {
    this.filterData.page = 1;
    this.infiniteScroll.disabled = true;
    this.noTicket = false;
    try {
      await this.apiSubs.unsubscribe();
    } catch (error) { }
    if (this.filterData.searchText.length > 0) {
      // when you clean the searchbar it should no display the spinner.
      this.showSpinner = true;
    }
    this.fetchTickets(event)
  }
}
