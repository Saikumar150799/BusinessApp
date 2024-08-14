import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { GatePassService } from '../../services/gatepass/gate-pass.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: "app-unit-search",
  templateUrl: "./unit-search.component.html",
  styleUrls: ["./unit-search.component.scss"],
})
export class UnitSearchComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() filterdListings:Array<string> ; 
  public loadingInstance: HTMLIonLoadingElement;
  public listings: Array<any> = []; 
  public emptyListings: boolean = false;
  public page: number = 1;
  public limit: number = 20;
  public searchText: string = "";
  public showSpinner: boolean = false;
  constructor(
    public modalCtrl: ModalController,
    public transService: translateService,
    public loadingCtrl: LoadingController,
    public gatePassService: GatePassService,
    public alertService: AlertServiceService,
    public navParams: NavParams
  ) {

  }

  ngOnInit() {
    this.getListings("");
  }

  async presentLoading() {
    this.loadingInstance = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstance.present();
  }

  async getListings(event) {
    if (!event) {
      await this.presentLoading();
    }
    this.gatePassService
      .getListings(this.page, this.limit, this.searchText)
      .subscribe(
        (data: any) => {
          this.listings = this.listings.concat(data.rows);
          this.emptyListings = data.rows.length === 0 ? true : false;
          event && event.target
            ? event.target.complete()
            : this.loadingInstance.dismiss();
          this.page += 1;
          if (this.page > Math.ceil(data.count / this.limit)) {
            this.infiniteScroll.disabled = true;
          } else {
            this.infiniteScroll.disabled = false;
          }
          this.showSpinner = false;
        },
        (err) => {
          this.loadingCtrl.dismiss();
          this.showSpinner = false;
          console.log(err);
          this.alertService.presentAlert("", err.error.message);
        }
      );
  }

  selectListing(listingId){
    this.filterdListings.indexOf(listingId) === -1 ? this.filterdListings.push(listingId) : this.filterdListings.splice(this.filterdListings.indexOf(listingId),1);

  }

  searchListings(event) {
    this.page = 1;
    this.listings = [];
    this.showSpinner = true;
    this.getListings(event);
  }

  checkForSelectedListings(listingId){
    return this.filterdListings.indexOf(listingId) != -1 ? true : false;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  applyFilter(){
    this.modalCtrl.dismiss(this.filterdListings);
  }
}
