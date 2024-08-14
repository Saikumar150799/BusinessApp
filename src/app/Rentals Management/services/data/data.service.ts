import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private myData: any;

  setData(data: any) {
    this.myData = data;
  }

  getData() {
    return this.myData;
  }
}
