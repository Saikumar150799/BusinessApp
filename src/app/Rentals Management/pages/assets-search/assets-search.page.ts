import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { TicketService } from '../../services/ticket.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-assets-search',
  templateUrl: './assets-search.page.html',
  styleUrls: ['./assets-search.page.scss'],
})
export class AssetsSearchPage implements OnInit {

  @Input() data;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public filterData: any = {
    limit: 15,
    page: 1,
    searchText: '',
    filterBy: ''
  }; 

  public assets: Array<any> = [];
  public showLoading: boolean = false;
  public emptyAssetsScreen: boolean = false;
  public selectedAssets: any[] = []
  constructor(
    public transService: translateService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public ticketService: TicketService,
    public alertService: AlertServiceService
  ) { }

  ngOnInit() {
    this.infiniteScroll.disabled = true;
    this.selectedAssets = _.cloneDeep(this.data.ticketData.assets);
    if(!_.isEmpty(this.data.ticketData)){
      this.filterData.filterBy = this.data.ticketData.ticketBelongsTo === "Project" || this.data.ticketData.ticketBelongsTo === "Facility" ? `&projects=${this.data.ticketData.ticketBelongsToRefId}` : `&homes=${this.data.ticketData.ticketBelongsToRefId}`;
      this.fetchAssets('');
    }
  }

  closeModal(value: boolean) {
    if (value) {
      if (this.selectedAssets.length > 0) {
        this.data.ticketData.assets = this.selectedAssets;
      }
      this.modalCtrl.dismiss(this.data.ticketData);
    } else {
      this.modalCtrl.dismiss();
    }
  }

  public fetchAssets (event) {
    if (!event) {
      this.showLoading = true;
    }
    this.ticketService.getAssets(this.filterData).subscribe((data: any)=>{
      
      this.showLoading = false;
      this.assets = this.assets.concat(data.rows);
      this.emptyAssetsScreen = data.rows.length === 0 ? true: false;

      this.filterData.page += 1;

      event ? event.target.complete() : this.showLoading = false;

      if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    },(err)=> {
      console.log("Error", err);
      this.showLoading = false;
      this.alertService.presentAlert('', err.error.message || 'Something went wrong')
    })

  }

  searchAssets() {
    this.assets = [];
    this.filterData.page = 1;
    this.fetchAssets('');
  }

  selectAsset(asset) {
    const index = this.selectedAssets.findIndex((item) => item._id === asset._id );
    if (index !== -1) {
      this.selectedAssets.splice(index, 1);
    } else {
      this.selectedAssets.push(asset);
    }
  }

  checkForAsset(asset) {
    const index = this.selectedAssets.findIndex((item) => item._id === asset._id);
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

}
