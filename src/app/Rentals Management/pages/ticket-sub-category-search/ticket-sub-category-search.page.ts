import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavParams } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ticket-sub-category-search',
  templateUrl: './ticket-sub-category-search.page.html',
  styleUrls: ['./ticket-sub-category-search.page.scss'],
})
export class TicketSubCategorySearchPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  subCategories: any[] = [];
  selectedSubCategory: any = {};
  displayedSubCategories: any[] = [];
  pageSize: number = 15;
  subCategorySearchText: string = '';
  subCategoriesSearchTextFiltered: any[] = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public transService: translateService
  ) {
    this.selectedSubCategory.name = this.navParams.get('name');
    this.selectedSubCategory.ticketSubCategory = this.navParams.get('ticketSubCategory');
    this.subCategories = this.navParams.get('subCategories');
    this.displayedSubCategories = this.subCategories.slice(0, this.pageSize);
  }

  ngOnInit() {
  }

  selectSubCategory(subCategory) {
    this.selectedSubCategory.name = subCategory.name;
    this.selectedSubCategory.ticketSubCategory = subCategory._id;
    this.closeModal(true);
  }

  searchSubCategory() {
    const searchText = this.subCategorySearchText.trim();

    if (!searchText) {
      this.displayedSubCategories = this.subCategories.slice(0, this.pageSize);
      return;
    }
  
    const regex = new RegExp(searchText, 'i');
    this.subCategoriesSearchTextFiltered = this.subCategories.filter((category) => {
      return regex.test(category.name)
    });
    this.displayedSubCategories = this.subCategoriesSearchTextFiltered.slice(0, this.pageSize);
    this.infiniteScroll.disabled = false;
  }

  loadData(event) {
    if (this.displayedSubCategories.length < this.subCategories.length) {
      const nextData = this.getMoreData();
      if (nextData.length > 0) {
        this.displayedSubCategories = _.concat(this.displayedSubCategories, nextData);
        if (event) {
          event.target.complete();
        }
      }else{
        event.target.disabled = true;
      }
    } else {
      event.target.disabled = true;
    }
  }

  getMoreData() {
    let startIndex = 0, endIndex = 0;
    if(this.subCategorySearchText.length > 0){
      startIndex = this.displayedSubCategories.length;
      endIndex = startIndex + this.pageSize;
      return this.subCategoriesSearchTextFiltered.slice(startIndex, endIndex);
    }else{
      startIndex = this.displayedSubCategories.length;
      endIndex = startIndex + this.pageSize;
      return this.subCategories.slice(startIndex, endIndex);
    }
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
