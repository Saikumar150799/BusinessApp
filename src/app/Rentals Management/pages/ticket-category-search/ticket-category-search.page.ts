import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
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
  public v2:boolean = false;
  public categoryFilter: any = {
    page: 1,
    limit: 20
  };
  public disableInfiniteScroll = false;

  constructor(
    private modalController: ModalController,
    private ticketService: TicketService,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    this.selectedCategory.name = this.navParams.get('name');
    this.selectedCategory.ticketCategory = this.navParams.get('ticketCategoryId');
    this.selectedCategory.subCategory = this.navParams.get('subCategories');
    this.v2 = this.navParams.get('v2');

    this.categoryFilter.ticketBelongsTo = this.navParams.get('ticketBelongsTo');
    this.categoryFilter.ticketBelongsToRefId = this.navParams.get('ticketBelongsToRefId');
    this.getCategories('');
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

  getCategories(event) {
    if (!event) {
      this.loading = true;
    }
    if(this.v2){
      this.ticketService.getTicketCategoriesV2(this.categoryFilter)
      .subscribe((data: any) => {
        event ? event.target.complete() : this.loading = false;
        this.categories = this.categories.concat(data.rows);
        this.categoryFilter.page += 1;
        if (this.categoryFilter.page > Math.ceil(data.count / this.categoryFilter.limit)) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.message);
        }
      );  
    }else{
      this.ticketService.getTicketCategories(this.categoryFilter)
      .subscribe((data: any) => {
        event ? event.target.complete() : this.loading = false;
        this.categories = this.categories.concat(data.rows);
        this.categoryFilter.page += 1;
        if (this.categoryFilter.page > Math.ceil(data.count / this.categoryFilter.limit)) {
          this.disableInfiniteScroll = true;
        }
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.message);
        }
      );  
    }
    
  }

}
