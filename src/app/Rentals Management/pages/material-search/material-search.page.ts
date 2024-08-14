import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

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
  public noMaterals: boolean = false;
  @Input() productId: string
  filterData = {
    page: 1,
    searchText: '',
    limit : 15
  };

  constructor(
    private loadingCtrl: LoadingController,
    private ticketService: TicketService,
    private modalController: ModalController,
    private alertService: AlertServiceService,
    public translateService: translateService
  ) {
    this.searchMaterial('');
    console.log(this.productId , "asdasdasdasd");
    
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

        this.materials = this.materials.concat(data.rows);

        this.noMaterals = this.materials.length === 0 ? true : false;

        this.filterData.page += 1;

        console.log(this.materials);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (this.filterData.page > Math.ceil(data.count/ this.filterData.limit)) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert('', err.error.message);
        }
      );
  }

  resetFilterAndSearch() {
    this.materials = [];
    this.filterData.page = 1;
    this.disableInfiniteScroll = false;
    this.searchMaterial('');
  }

}
