import { HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { buildFor, connectTo, organizations, CommonAuth } from "./organization.json";
import { Injectable } from '@angular/core';
import { StorageService } from '../common-services/storage-service.service.js';

@Injectable({
    providedIn: 'root'
})
export class MainAppSetting {

    public ORG = buildFor;
    public organizations = organizations;
    public userId;
    public appFor = connectTo;
    public storag = new Storage({});
    public token: string;
    public platform = '';
    public EnglishMonthNames: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public EnglishDateNames: Array<string> = [];
    public arabicMonthNames: Array<string> = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيه', 'يوليه', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    public arabicDateNames: Array<string> = [];
    private loacalApi = 'http://0.0.0.0:';
    constructor(
        private storageService: StorageService
    ) {
        this.storageService.getDatafromIonicStorage('token').then(data => {
            this.token = data;
        });
        this.storageService.getDatafromIonicStorage('user_id').then(data => {
            this.userId = data;
        });
        // this.storageService.getDatafromIonicStorage('platform').then(data => {
        //     this.platform = data
        // })
    }




    // public API = API;
    public HTTPHEADER = this.getHttpHeades();

    getPlatform() {
        this.storageService.getDatafromIonicStorage('platform').then(data => {
            this.platform = data;
        });
    }

    getHttpHeades() {

      let orgId = window.localStorage.getItem('organization') || '';
      
      const organizations = orgId.length > 0  ? [ orgId ] : this.organizations;

      const httpHeades = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "x-organizations": organizations,
          "x-type": "myTeam"
        })
      };
      return httpHeades;
    }

    setTokenAferLogin(token) {
        this.token = token;
    }

    setPlatformAfterLogin(data: string) {
        this.platform = data;
    }


    getHttpHeadesWithToken(source = ''): object {
        const httpHeadesWithToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                authorization: this.token,
                source: source
            })
        };
        return httpHeadesWithToken;
    }


    getHttpHeadersForFormData(): object {
        const httpHeadersFormData = {
            headers: new HttpHeaders({
                enctype: 'multipart/form-data;',
                authorization: this.token
            })
        };

        return httpHeadersFormData;
    }

    getApi() {
        let API = '';
        let baseURL: string = '';

        this.storageService.getDatafromIonicStorage('platform').then(data => {
            this.platform = data;
        });

        baseURL = window.localStorage.getItem('baseURL') || '';

        if (CommonAuth && baseURL.length > 0) {
          API = baseURL;
        } else {
          if (this.ORG === "Both") {
            if (window.localStorage.getItem("platform") === "rm") {
              if (this.appFor === "alpha") {
                API = "https://staging.thehousemonk.com";
              } else if (this.appFor === "production") {
                API = "https://dashboard.thehousemonk.com";
              } else {
                API = this.loacalApi + "9000";
              }
            } else {
              if (this.appFor === "alpha") {
                API = "https://alpha.thehousemonk.com";
              } else if (this.appFor === "production") {
                API = "https://thehousemonk.com";
              } else {
                API = this.loacalApi + "3020";
              }
            }
          } else if (this.ORG === "RM") {
            window.localStorage.setItem("appSrc", "rentals");
            this.storageService.storeDataToIonicStorage("appSrc", "rentals");

            if (this.appFor === "alpha") {
              API = "https://staging.thehousemonk.com";
            } else if (this.appFor === "production") {
              API = "https://dashboard.thehousemonk.com";
            } else {
              API = this.loacalApi + "9000";
            }
          } else if (this.ORG === "BM") {
            window.localStorage.setItem("appSrc", "building-management");
            this.storageService.storeDataToIonicStorage("appSrc","building-management"
            );

            if (this.appFor === "alpha") {
              API = "https://alpha.thehousemonk.com";
            } else if (this.appFor === "production") {
              API = "https://thehousemonk.com";
            } else {
              API = this.loacalApi + "3020";
            }
          }
        }   
        console.log('-------MAIN APP', API);
        return API;
    }
    // public static API = API;

}



// "cordova-plugin-googlemaps": {
//     "API_KEY_FOR_ANDROID": "AIzaSyAH3tjUqRBphM-E6jLm0Va70Dr1uOoDNBA"
//   }
