import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TicketService } from '../../services/ticket.service';
import { LoadingController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as jsonFile from '../../../conatants/organization.json'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  dateList = [];
  tickets: any[] = [];
  public pet: any;
  disableInfiniteScroll = false;
  disableSegmentButton = false;
  public noTickets: boolean = false;
  public showprogressLoader: boolean = false;
  public app: string = jsonFile.appBundleId;
  private loadingInstence: HTMLIonLoadingElement;
  filterData: any = {
    page: 1,
    searchText: '',
    ticketBelongsTo: 'home',
    type: '',
    priority: '&priority=low&priority=high',
    status: 'status=open&status=in-progress',
    limit: 10,

  };

  constructor(
    private ticketService: TicketService,
    private loading: LoadingController,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    moment.locale('en')
    this.filterData.startDate = `&startDate=${moment((new Date(new Date().setHours(0, 0, 0, 0))).toJSON()).format('YYYY-MM-DD')}`;
    this.filterData.endDate = `&endDate=${moment((new Date(new Date().setHours(23, 59, 59, 999))).toJSON()).format('YYYY-MM-DD')}`;
    this.showprogressLoader = true;
    this.searchTicket('');
  }

  ngOnInit() {
    const date = new Date();
    const startDate = new Date(date.setDate(date.getDate() - 5));
    for (let i = 0; i <= 8; i++) {
      this.dateList.push(new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  }

  async presentLoading() {
    this.loadingInstence = await this.loading.create({
      spinner: "lines"
    });
    await this.loadingInstence.present();
  }

  async searchTicket(event) {
    if (!event) {
      this.disableInfiniteScroll = false;
    } else {
      this.disableSegmentButton = true;
    }

    this.ticketService.getTickets(this.filterData.page, this.filterData.searchText, this.filterData.status, this.filterData.ticketBelongsTo, this.filterData.type ? `&type=${this.filterData.type}` : '', '', '', this.filterData.startDate, this.filterData.endDate, '', '', '', '',  '', '', '')
      .subscribe((data: any) => {

        this.tickets = this.tickets.concat(data.rows);
        this.noTickets = data.rows.length === 0 ? true : false;
        this.filterData.page += 1;

        this.showprogressLoader = false;

        if (event) {
          event.target.complete();
          this.disableSegmentButton = false;
        } 

        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.disableInfiniteScroll = true;
        } else {
          this.disableInfiniteScroll = false;
        }
      },
        err => {

          this.showprogressLoader = false;

          this.alertService.presentAlert("", err.error.message);
        }
      );
  }

  resetDate(date) {
    moment.locale('en')
    this.tickets = [];
    this.noTickets = false;
    this.filterData.page = 1;
    this.disableInfiniteScroll = true;
    this.showprogressLoader = true;
    this.filterData.startDate = `&startDate=${moment((new Date(new Date(date).setHours(0, 0, 0, 0))).toJSON()).format('YYYY-MM-DD')}`;
    this.filterData.endDate = `&endDate=${moment((new Date(new Date(date).setHours(23, 59, 59, 999))).toJSON()).format('YYYY-MM-DD')}`;
    this.searchTicket('');
  }
  arabic(num: any) {   // ********** Used to convert number into different language using locale **********
    let x: number = parseInt(num)
    return x.toLocaleString('ar-EG')
  }

  filterTickets() {
    this.tickets = [];
    this.noTickets = false;
    this.filterData.page = 1;
    this.disableInfiniteScroll = true;
    this.showprogressLoader = true;
    this.searchTicket('');
  }

}
