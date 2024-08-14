import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: 'app-give-notice',
  templateUrl: './give-notice.page.html',
  styleUrls: ['./give-notice.page.scss'],
})
export class GiveNoticePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public transService: translateService,
    public loadingCtrl: LoadingController,
    public checkInCheckOutService: CheckInCheckOutService,
    public alertService: AlertServiceService
  ) { }
  private loadingInstence: HTMLIonLoadingElement;
  public filterData: any = {
    page: 1,
    limit: 10,
    searchText: "",
    type: 'give_notice'
  };
  public units: Array<any> = [];
  public emptyScreen: boolean = false;
  public loader: boolean = false;
  
  ngOnInit() {
    this.getUnits('');
  }

  public async presentLoading(){
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return this.loadingInstence.present()
  }
  
  async searchUnits(event) {
    this.filterData.page = 1;
    this.units = [];
    this.infiniteScroll.disabled=true;
    if (this.filterData.searchText.length > 0) {
      this.loader = true;
    }

    await this.getUnits(event)

  }
  async getUnits(event){
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
      this.alertService.presentAlert('',err.error.message || 'Something went wrong');
      console.log(err);
    },() => {
      this.loader = false;
    })
  }
}
