import { Component, OnInit, ViewChild } from "@angular/core";
import { IonDatetime, IonInfiniteScroll, LoadingController } from "@ionic/angular";
import * as moment from "moment";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { CheckInCheckOutService } from "../../services/ci-co/check-in-check-out.service";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.page.html",
  styleUrls: ["./check-in.page.scss"],
})
export class CheckInPage implements OnInit {
  @ViewChild("datePicker") datePicker: IonDatetime;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public selectedDate = moment(new Date()).toISOString();
  public selectedTab: string = "upcoming";
  public todayDate: string = moment().format();
  public showTodayButton: boolean = false;
  public showDatePicker: boolean = false;
  private loadingInstence: HTMLIonLoadingElement;
  public units: Array<any> = [];
  public emptyScreen: boolean = false;
  public loader: boolean = false;

  filterData: any = {
    page: 1,
    limit: 10,
    searchText: "",
  };
  constructor(
    public transService: translateService,
    public checkInCheckOutService: CheckInCheckOutService,
    public loadingCtrl: LoadingController,
    public alertService: AlertServiceService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParamMap.subscribe(({params}: any) => {
    this.filterData.page = 1;
    this.units = [];
    this.infiniteScroll.disabled = true;
    this.getCheckInsList("", this.selectedTab);
    });
  }

  ngOnInit() {
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  nextDay() {
    this.selectedDate = moment(this.selectedDate).add(1, "d").toISOString();
    this.checkTodayBtnAvailable();
    this.units = [];
  }

  prevDay() {
    this.selectedDate = this.selectedDate = moment(this.selectedDate)
      .subtract(1, "d")
      .toISOString();
    this.checkTodayBtnAvailable();
    this.units = [];
  }

  public onTabChange() {
    switch (this.selectedTab) {
      case "upcoming":
        console.log("upcoming");
        this.filterData.page = 1;
        this.units = [];
        this.filterData.searchText = '';
        this.getCheckInsList("", "upcoming");
        break;
      case "re-confirm":
        console.log("re-confirm");
        this.filterData.page = 1;
        this.units = [];
        this.filterData.searchText = '';
        this.getCheckInsList("", "re-confirm");
        break;

      default:
        console.log("completed");
        this.filterData.page = 1;
        this.units = [];
        this.filterData.searchText = '';
        this.getCheckInsList("", "completed");
        break;
    }
  }

  public async getCheckInsList(event, type) {
    this.filterData.date = moment(this.selectedDate).toISOString();;
    this.filterData.type = type;
    
    if (!event) {
      await this.presentLoading();
    }

    this.checkInCheckOutService.getCheckInLists(this.filterData).subscribe(
      (data: any) => {
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
      },
      (err) => {
        this.loadingCtrl.dismiss();
        console.log("Error", err);
        this.alertService.presentAlert("", err.error.message);
      },() => {
        this.loader = false;
      }
    );
  }

  async searchUnits(event) {
    // this.loader = true;
    this.filterData.page = 1;
    this.units = [];
    this.infiniteScroll.disabled=true;
    if (this.filterData.searchText.length > 0) {
      // when you clean the searchbar it should no display the spinner.
      this.loader = true;
    }

    await this.getCheckInsList(event,this.selectedTab)

  }

  today() {
    this.selectedDate = moment().format();
  }

  checkTodayBtnAvailable() {
    this.showTodayButton = moment().isSame(this.selectedDate, "day")
      ? false
      : true;
  }

  // getCheckInsList not calling in nextday,prevday,today fun becz when ever the time changes this fun will trigger
  dateCahnge() {
    console.log("date changed");
    this.checkTodayBtnAvailable();
    this.units = [];
    this.filterData.page = 1;
    this.getCheckInsList(Event, this.selectedTab);
  }
}
