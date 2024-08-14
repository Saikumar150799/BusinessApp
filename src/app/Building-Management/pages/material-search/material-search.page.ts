import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-material-search',
  templateUrl: './material-search.page.html',
  styleUrls: ['./material-search.page.scss'],
})
export class MaterialSearchPage implements OnInit {

  materials: any[] = [];
  loading = false;
  disableInfiniteScroll = false;
  selectedMaterial: any = {};

  filterData = {
    skip: 0,
    searchText: ''
  };

  constructor(
    private loadingCtrl: LoadingController,
    private ticketService: TicketService,
    private modalController: ModalController,
    private alertService: AlertServiceService
  ) {
    this.searchMaterial('');
  }

  ngOnInit() {
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedMaterial);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  selectMaterial(material) {
    this.selectedMaterial = material;
    this.closeModal(true);
  }

  // async presentLoading() {
  //   this.loading = await this.loadingCtrl.create({
  //   });
  //   this.loading.present();
  // }

  // type, searchtext, skip, token, status

  async searchMaterial(event) {

    if (!event) {
      this.loading = true;
    }

    this.ticketService.searchMaterials(this.filterData)
      .subscribe((data: any) => {

        this.materials = this.materials.concat(data.data);
        this.filterData.skip = data.query.skip + 10;

        console.log(this.materials);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (data.query.current >= data.query.total) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert('', err.error.error);
        }
      );
  }

  resetFilterAndSearch() {
    this.materials = [];
    this.filterData.skip = 0;
    this.disableInfiniteScroll = false;
    this.searchMaterial('');
  }

}
