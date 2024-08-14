import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavParams } from '@ionic/angular';
import { UnitService } from '../../services/unit.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-unit-search',
  templateUrl: './unit-search.page.html',
  styleUrls: ['./unit-search.page.scss'],
})
export class UnitSearchPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  units: any[] = [];
  loading = false;
  selectedUnit: any = {};
  searchTerm: any;
  filterData: any = {
    page: 1,
    searchText: '',
    limit: 15
  };
  @Input() homeId: string;

  constructor(
    private unitService: UnitService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {

  }

  ngOnInit() {
    if (this.navParams.get('id')) {
      this.selectedUnit.listings = this.navParams.get('id');
      this.selectedUnit.listingName = this.navParams.get('name');  
    }

    this.searchUnit('');
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedUnit);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  selectUnit(unit) {
    this.selectedUnit.listingName = ''
    if (unit.block) {
      this.selectedUnit.listingName = unit.block;
    }
    if (unit.door) {
      this.selectedUnit.listingName = this.selectedUnit.listingName + unit.door;
    }
    if (unit.name) {
      this.selectedUnit.listingName = this.selectedUnit.listingName ?  (this.selectedUnit.listingName + ', ' + unit.name) : unit.name;
    }

    this.selectedUnit.listings = unit._id;
    this.closeModal(true);
  }

  async searchUnit(event) {

    if (!event) {
      this.loading = true;
    }

    this.unitService.getUnitsByHomeId(this.filterData, this.homeId)
      .subscribe((data: any) => {

        this.units = this.units.concat(data.rows);
        this.filterData.page += 1;

        console.log(this.units);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.message);
        }
      );
  }

  resetFilterAndSearch() {
    this.units = [];
    this.filterData.page = 1;
    this.infiniteScroll.disabled = true;
    this.searchUnit('');
  }

}
