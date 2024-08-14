import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { FacilityBookingService } from '../../services/facility-booking.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-ticket-facility-search',
  templateUrl: './ticket-facility-search.component.html',
  styleUrls: ['./ticket-facility-search.component.scss'],
})
export class TicketFacilitySearchComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() projectId: string;
  @Input() facility: {};

  public filterData: any = {
    facilityPage: 1,
    limit: 15,
    searchTextFacility: "",
  };

  public facilityDataFromFilterPage: any = {
    status: ["active"],
    projects: [],
    category: ['Facilities'],
    sort: ["-createdAt"],
  };

  public facilities: Array<any> = [];
  public loading: boolean = false;
  public selectedFacility: any = {
    facility: { _id: ''}
  };
  public emptyScreen: boolean = false;

  constructor(
    public modalController: ModalController,
    public transService: translateService,
    public facilityService: FacilityBookingService,
    public alertService: AlertServiceService
  ) { }

  ngOnInit() {
    if(this.projectId != "") {
      this.facilityDataFromFilterPage.projects.push(this.projectId);
      this.searchFacility('');
    }

    if(!_.isEmpty(this.facility)) {
      this.selectedFacility.facility = this.facility;
    }
  }

  public searchFacility(event) {
    if (!event) {
      this.loading = true;
    }
    this.facilityService.getFacilities(this.filterData, this.facilityDataFromFilterPage).subscribe((data: any) => {
      console.log("data",data);
      this.facilities = this.facilities.concat(data.rows);
      this.filterData.facilityPage += 1;
      event ? event.target.complete() : this.loading = false;
      console.log('loading should dismiss');
      this.emptyScreen = this.facilities.length === 0 ? true : false;
      if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }

    },(error)=>{
      console.log(error);
      this.loading = false;
      this.alertService.presentAlert('', error.message);
    })

  }

  selectFacility(facility) {
    this.selectedFacility.facility = facility;
    this.closeModal(true);
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedFacility);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  resetFilterAndSearch() {
    this.facilities = [];
    this.filterData.facilityPage = 1;
    this.infiniteScroll.disabled = true;
    this.searchFacility('');
  }

}
