import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { GatepassFilterComponent } from '../../modals/gatepass-filter/gatepass-filter.component';
import { GatePassService } from '../../services/gatepass/gate-pass.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '@ionic/angular';
@Component({
  selector: "app-gatepass",
  templateUrl: "./gatepass.page.html",
  styleUrls: ["./gatepass.page.scss"],
})
export class GatepassPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public loadingInstence: HTMLIonLoadingElement;
  public toggleValue: boolean = false;
  public gatePasses: any = [];
  public noGatePasses: boolean = false ;
  public loader: boolean = false;
  public gatepassFilteredData: any = {
    status: ["open", "in-progress", "approved", "rejected"],
    gatepassBelongsTo: ["returnable", "non-returnable"],
    listings: [],
    page: 1,
    searchText: "",
    limit: 10,
    user: ''
  };

  constructor(
    public transService: translateService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public gatePassService: GatePassService,
    public alertService: AlertServiceService,
    public router: Router,
    public events: Events,
    public route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.gatepassFilteredData.page = 1;
      this.gatePasses = [];
      this.fetchGatePasses("");
    })
  }

  ngOnInit() {
    
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: GatepassFilterComponent,
      componentProps: {
        data: JSON.parse(JSON.stringify(this.gatepassFilteredData)),
      },
    });
    modal.onDidDismiss().then((gatepassFilter: any) => {
      if (gatepassFilter != null && gatepassFilter.data) {

        this.gatepassFilteredData.inwardDate = gatepassFilter.data.inwardDate || "";
        this.gatepassFilteredData.outwardDate = gatepassFilter.data.outwardDate || "";
        this.gatepassFilteredData.createdDate = gatepassFilter.data.createdDate || "";
        
        this.gatepassFilteredData = Object.assign(this.gatepassFilteredData,gatepassFilter.data);
        this.gatepassFilteredData.page = 1;
        this.infiniteScroll.disabled = true;

        this.gatePasses = [];
        this.fetchGatePasses("");
      }
    });

    return modal.present();
  }

  async fetchGatePasses(event) {

    if (!event) {
      this.presentLoading();
    }
    console.log('filter',this.gatepassFilteredData);
    await this.gatePassService
      .getGatePasses(this.gatepassFilteredData)
      .subscribe(
        (data: any) => {
          this.gatePasses = this.gatePasses.concat(data.rows);
          this.noGatePasses = data.rows.length === 0 ? true : false ;
          event && event.target
            ? event.target.complete()
            : this.loadingInstence.dismiss();
          this.gatepassFilteredData.page += 1;
          this.loader = false;
          if (
            this.gatepassFilteredData.page >
            Math.ceil(data.count / this.gatepassFilteredData.limit)
          ) {
            this.infiniteScroll.disabled = true;
          } else {
            this.infiniteScroll.disabled = false;
          }
        },
        (err) => {
          console.log(err);
          this.loadingCtrl.dismiss();
          this.loadingInstence.dismiss();
          this.alertService.presentAlert("", err.error.message);
        }
      );
  }

  async toggleChanged(event: CustomEvent) {
    this.toggleValue = event.detail.checked;
    let userId
    await this.alertService.getDataFromLoaclStorage('user_id').then(val => {
      userId = val;
    })
    this.noGatePasses = false;
    if (this.toggleValue) {
      this.gatePasses = [];
      this.gatepassFilteredData.page = 1;
      this.gatepassFilteredData.user = `&user=${userId}`;
      this.fetchGatePasses('');
    } else {
      this.gatePasses = [];
      this.gatepassFilteredData.page = 1;
      this.gatepassFilteredData.user = '';
      this.fetchGatePasses('');
    }
  }

  routeToGatePassDetails(gatepass){
    this.router.navigate(['/rentals-gatepas-details'],{queryParams: {gatePassId: gatepass._id}})
  }

  searchGatePasses(event){
    this.loader = true;
    this.gatepassFilteredData.page = 1;
    this.infiniteScroll.disabled = true;
    this.gatePasses = [];
    this.fetchGatePasses(event) ;
  }
}
