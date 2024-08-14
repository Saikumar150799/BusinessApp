import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: 'app-check-out-search',
  templateUrl: './check-out-search.page.html',
  styleUrls: ['./check-out-search.page.scss'],
})
export class CheckOutSearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    public transService: translateService,
    public loadingCtrl: LoadingController,
    public checkInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService
  ) { }
  public selectedDate = moment(new Date()).toISOString();
  public units: Array<any>[] = [];
  public selectedTab: string = 'upcoming';
  public filterData: any = {
    page: 1,
    limit: 10,
    searchText: "",
  };
  public loader: boolean = false;
  public emptyScreen: boolean = false;
  ngOnInit() {
    this.getUnits("");
  }

  public async presentLoading(){
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    })

    return loading.present();
  }

  nextDay() {
    this.selectedDate = moment(this.selectedDate).add(1, "d").toISOString();
    this.units = [];
  }

  prevDay() {
    this.selectedDate = this.selectedDate = moment(this.selectedDate).subtract(1, "d").toISOString();
    this.units = [];
  }

  dateCahnge() {
    console.log("date changed");
    this.units = [];
    this.filterData.page = 1;
    const type = this.selectedTab === 'upcoming' ? 'checkout_pending' : 'checkout_completed';
    this.infiniteScroll.disabled=true;
    this.getUnits(Event);
  }

  public onTabChange() {
    switch (this.selectedTab) {
      case "upcoming":
        this.filterData.page = 1;
        this.units = [];
        this.filterData.searchText = '';
        this.getUnits("");
        break;
      case "completed":
        this.filterData.page = 1;
        this.units = [];
        this.filterData.searchText = '';
        this.getUnits("");
        break;
    }
  }

  async searchUnits(event) {
    this.filterData.page = 1;
    this.units = [];
    this.infiniteScroll.disabled=true;
    if (this.filterData.searchText.length > 0) {
      this.loader = true;
    }
    // const type = this.selectedTab === 'upcoming' ? 'checkout_pending' : 'checkout_completed'
    await this.getUnits(event);

  }

  async getUnits(event){
    this.filterData.date = moment(this.selectedDate).toISOString();;
    this.filterData.type = this.selectedTab === 'upcoming' ? 'checkout_pending' : 'checkout_completed';
    if (!event) {
      await this.presentLoading();
    }
    this.checkInCheckOutService.getCheckOutUnits(this.filterData).subscribe((data: any)=>{
      event &&  event.target ? event.target.complete() : setTimeout(() => {
        event!="search" ? this.loadingCtrl.dismiss() : '';
      }, 200);
      this.units = this.units.concat(data.rows);
        this.emptyScreen = data.rows.length === 0 ? true : false;
        this.filterData.page += 1;
        if (
          this.filterData.page > Math.ceil(data.count / this.filterData.limit)
        ) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
    },(err)=>{
      this.loadingCtrl.dismiss();
      console.log("Error", err);
      this.alertService.presentAlert("", err.error.message);
    },() => {
      this.loader = false;
    })
  }

}
