import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public appSrc;
  public projectId;
  public token;
  constructor(private storage: Storage) {
    this.storage.get('appSrc').then(val => {
      this.appSrc = val;
    })
  }

  gettoken() {
    this.storage.get('token').then(data => {
      this.token = data;
    })
    return this.token

  }


  storeDataToIonicStorage(key, value) {
    this.storage.set(key, value);
  }
  async getDatafromIonicStorage(key) {
    return this.storage.get(key)
  }

  emptyStorage() {
    this.storage.clear();
  }

  removeItem(item) {
    return this.storage.remove(item)
  }

}
