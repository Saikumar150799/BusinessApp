import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UnitService } from '../../services/unit.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-unit-search',
  templateUrl: './unit-search.page.html',
  styleUrls: ['./unit-search.page.scss'],
})
export class UnitSearchPage implements OnInit {

  units: any[] = [];
  loading = false;
  disableInfiniteScroll = false;
  selectedUnit: any = {};
  searchTerm: any;

  filterData = {
    skip: 0,
    searchText: ''
  };

  constructor(
    private unitService: UnitService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    if (this.navParams.get('id')) {
      this.selectedUnit.ticketBelongsToRefId = this.navParams.get('id');
      this.selectedUnit.ticketBelongsToName = this.navParams.get('name');
    }

    this.searchUnit('');
  }

  ngOnInit() {
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
    this.selectedUnit.ticketBelongsToName=''
    if (unit.block) {
      this.selectedUnit.ticketBelongsToName = unit.block;
    }
    if (unit.door) {
      this.selectedUnit.ticketBelongsToName = this.selectedUnit.ticketBelongsToName + unit.door;
    }
    if (unit.name) {
      this.selectedUnit.ticketBelongsToName = this.selectedUnit.ticketBelongsToName + ', ' + unit.name;
    }

    this.selectedUnit.ticketBelongsToRefId = unit._id;
    this.closeModal(true);
  }

  async searchUnit(event) {

    if (!event) {
      this.loading = true;
    }

    this.unitService.getUnits(this.filterData)
      .subscribe((data: any) => {

        this.units = this.units.concat(data.data.data);
        this.filterData.skip = data.data.query.skip + 10;

        console.log(this.units);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  resetFilterAndSearch() {
    this.units = [];
    this.filterData.skip = 0;
    this.disableInfiniteScroll = false;
    this.searchUnit('');
  }

}
