import { Component, OnInit ,Input } from '@angular/core';
import {PopoverController } from '@ionic/angular';
import { StorageService } from 'src/app/common-services/storage-service.service';

@Component({
  selector: 'app-sort-filter',
  templateUrl: './sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent implements OnInit {
  @Input() bookingFilter:any

  constructor(
    private popover: PopoverController,
    private storageService: StorageService,
  ) {
   }

  ngOnInit() {
    const sortByValue = window.localStorage.getItem('sortByValue');
    this.bookingFilter.sort.splice(0,1,sortByValue)

  }
  
  async selectSortValue(value){
    this.bookingFilter.sort.splice(0,1,value)
    window.localStorage.setItem('sortByValue',value);
    await this.storageService.storeDataToIonicStorage('sortByValue',value);
    console.log("bookingFilter",this.bookingFilter);
    this.popover.dismiss(true);
  }
}
