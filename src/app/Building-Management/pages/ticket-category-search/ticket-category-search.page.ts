import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-ticket-category-search',
  templateUrl: './ticket-category-search.page.html',
  styleUrls: ['./ticket-category-search.page.scss'],
})
export class TicketCategorySearchPage implements OnInit {

  categories: any[] = [];
  selectedCategory: any = {};
  loading = false;

  constructor(
    private modalController: ModalController,
    private ticketService: TicketService,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    this.selectedCategory.name = this.navParams.get('name');
    this.selectedCategory.ticketCategory = this.navParams.get('ticketCategory');
    this.selectedCategory.subCategory = this.navParams.get('subCategories');

    const categoryFilter = {
      ticketBelongsTo: this.navParams.get('ticketBelongsTo'),
      ticketBelongsToRefId: this.navParams.get('ticketBelongsToRefId')
    };
    this.getCategories(categoryFilter);
  }

  ngOnInit() {
  }

  selectCategory(category) {
    this.selectedCategory.name = category.name;
    this.selectedCategory.ticketCategory = category._id;
    this.selectedCategory.subCategory = category.subCategory;
    this.closeModal(true)
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedCategory);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  getCategories(categoryFilter) {
    this.loading = true;
    this.ticketService.getTicketCategories(categoryFilter)
      .subscribe((data: any) => {
        this.loading = false;
        this.categories = data;
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

}
