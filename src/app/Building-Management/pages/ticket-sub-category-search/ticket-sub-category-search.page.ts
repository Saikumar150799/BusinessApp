import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-ticket-sub-category-search',
  templateUrl: './ticket-sub-category-search.page.html',
  styleUrls: ['./ticket-sub-category-search.page.scss'],
})
export class TicketSubCategorySearchPage implements OnInit {

  subCategories: any[] = [];
  selectedSubCategory: any = {};

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public transService: translateService
  ) {
    this.selectedSubCategory.name = this.navParams.get('name');
    this.selectedSubCategory.ticketSubCategory = this.navParams.get('ticketSubCategory');
    this.subCategories = this.navParams.get('subCategories');
  }

  ngOnInit() {
  }

  selectSubCategory(subCategory) {
    this.selectedSubCategory.name = subCategory.name;
    this.selectedSubCategory.ticketSubCategory = subCategory._id;
    this.closeModal(true);
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedSubCategory);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }

  }

}
