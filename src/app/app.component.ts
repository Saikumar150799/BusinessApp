import { Component } from '@angular/core';

import { Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './common-services/storage-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from './Rentals Management/services/rentals-user.service';
import { AlertServiceService } from './common-services/alert-service.service';
import { BuildingUserService } from './Building-Management/services/building-user.service';
import * as organizationFile from './conatants/organization.json'
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
import { translateService } from './common-services/translate/translate-service.service';
import { GoogleService } from './google.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {

  public appPages = {
    name: '',
    phoneNumber: localStorage.getItem('phoneNumber'),
    pages: organizationFile.pages,
    logout: {
      title: 'Logout',
      src: '/assets/svg-icons/log-out.svg',

    }

  }
  private loaginInstence: HTMLIonLoadingElement;
  public APP_VERSION = organizationFile.appVersion;
  public moduleAccess: any = {
    accessControl: { access: true, read: true, create: true, update: true, delete: true },
    accountsAnalytics: { access: true, read: true, create: false, update: false, delete: false },
    assets: { access: true, read: true, create: true, update: true, delete: true },
    billAndExpenses: { access: true, read: true, create: true, update: true, delete: true },
    booking: { access: true, read: true, create: true, update: true, delete: true },
    bulkCreate: { access: true, read: true, create: false, update: false, delete: false },
    chartOfAccounts: { access: true, read: true, create: true, update: true, delete: true },
    discussion: { access: true, read: true, create: true, update: true, delete: true },
    domesticHelp: { access: true, read: true, create: true, update: true, delete: true },
    facilityBooking: { access: true, read: true, create: true, update: true, delete: true },
    importWizard: { access: true, read: true, create: true, update: true, delete: true },
    invoice: { access: true, read: true, create: true, update: true, delete: true },
    noticeBoard: { access: true, read: true, create: true, update: true, delete: true },
    overviewAnalytics: { access: true, read: true, create: false, update: false, delete: false },
    payment: { access: true, read: true, create: true, update: true, delete: true },
    ppms: { access: true, read: true, create: true, update: true, delete: true },
    productAndServices: { access: true, read: true, create: true, update: true, delete: true },
    project: { access: true, read: true, create: true, update: true, delete: true },
    quotation: { access: true, read: true, create: true, update: true, delete: true },
    receipts: { access: true, read: true, create: true, update: true, delete: true },
    refund: { access: true, read: true, create: true, update: true, delete: true },
    reminders: { access: true, read: true, create: false, update: false, delete: false },
    reports: { access: true, read: true, create: false, update: false, delete: false },
    settings: { access: true, read: true, create: true, update: true, delete: true },
    staff: { access: true, read: true, create: true, update: true, delete: true },
    ticketAnalytics: { access: true, read: true, create: false, update: false, delete: false },
    tickets: { access: true, read: true, create: true, update: true, delete: true },
    units: { access: true, read: true, create: true, update: true, delete: true },
    user: { access: true, read: true, create: true, update: true, delete: true },
    vendor: { access: true, read: true, create: true, update: true, delete: true },
    visitorLog: { access: true, read: true, create: true, update: true, delete: true },
    voteAndPoll: { access: true, read: true, create: true, update: true, delete: true },
    workOrder: { access: true, read: true, create: false, update: false, delete: false },
    other: {}
  }
  public appSrc: string;
  // options: PushOptions = {
  //   android: {},
  //   ios: {
  //   },
  // }
  // pushObject: PushObject = this.push.init(this.options);

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    public translate: TranslateService,
    private storageService: StorageService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private rentalsUserService: RentalsUserService,
    private alertService: AlertServiceService,
    private buildingUserService: BuildingUserService,
    public translateService: translateService,
    private alertController: AlertController,
    private googleService: GoogleService
    // private push: Push
  ) {
    this.initializeApp();
  }
  ionViewDidLoad() {
    console.log("load");
  }

  async presentLoading() {
    this.loaginInstence = await this.loadingCtrl.create({
      spinner: 'lines',
    });
    await this.loaginInstence.present();

  }

  async routeForword(url) {
    await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
      this.appSrc = val;
      console.log("-----------------", val)
      this.router.navigateByUrl(`${this.appSrc}${url}`)
    })
  }

  initializeApp() {
    let isLoggedIn: string;
    this.platform.ready().then(async () => {
      registerLocaleData(localeAr)
      // document.documentElement.dir = "rtl";
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#ffffff');
      await this._initTranslate()
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      await this.storageService.getDatafromIonicStorage('isLoggedIn').then(val => {
        isLoggedIn = val;
        console.log(typeof val);

      })
      await this.storageService.getDatafromIonicStorage('moduleAccess').then(val => {
        val ? this.moduleAccess = JSON.parse(val) : '';
      });
      await this.storageService.getDatafromIonicStorage('appSrc').then(val => {
        this.appSrc = val;
      })
      await isLoggedIn == 'true' ? (this.googleService.initiateGoogleAnalytics(), this.navCtrl.navigateRoot(`/${this.appSrc}-home`)) : this.navCtrl.navigateRoot('/login');
    });
  }

  // logout() {
  //   window.localStorage.clear()
  //   this.storage.clear()
  //   this.router.navigateByUrl('/login')
  // }



  async logOut() {
    await this.presentLoading();
    let userId;
    await this.storageService.getDatafromIonicStorage('user_id').then(val => {
      userId = val;
    })
    this.storageService.getDatafromIonicStorage('appSrc').then(val => {
      if (val == 'rentals') {
        this.rentalsUserService.getUserById(userId).subscribe(async data => {
          if (data.businessAppDevice && data.businessAppDevice.pushToken) {
            delete data.businessAppDevice
            console.log(data);
            this.updateUser(val, data)
          } else {
            await this.loaginInstence.dismiss();
            window.localStorage.clear();
            await this.storageService.emptyStorage()
            this.navCtrl.navigateRoot('/login');
          }

        })
      } else if (val == 'building-management') {
        this.buildingUserService.getUserById(userId).subscribe(async data => {
          if (data.businessAppDevice && data.businessAppDevice.pushToken) {
            delete data.businessAppDevice
            console.log(data);
            this.updateUser(val, data)
          } else {
            await this.loaginInstence.dismiss();
            window.localStorage.clear();
            await this.storageService.emptyStorage()
            this.navCtrl.navigateRoot('/login');
          }
        })
      }

    })
    // window.localStorage.clear();
    // await this.storage.clear()
    // this.navCtrl.navigateRoot('/login');
  }

  async updateUser(val, data) {
    if (val == 'rentals') {
      this.rentalsUserService.updateUser(data).subscribe(
        async (data: any) => {
          await this.loaginInstence.dismiss();
          window.localStorage.clear();
          await this.storage.forEach((value: string, key: string) => {
            key === 'lang' ? '' : this.storage.remove(key)
          })
          this.navCtrl.navigateRoot('/login');
        }, async err => {
          await this.loaginInstence.dismiss();
          this.alertService.presentAlert('', this.translateService.getTranslatedData('Error while logging out'))
        })
    } else if (val == 'building-management') {
      this.buildingUserService.updateUser(data).subscribe(
        async (data: any) => {
          await this.loaginInstence.dismiss();
          window.localStorage.clear();
          await this.storage.forEach((value: string, key: string) => {
            key === 'lang' ? '' : this.storage.remove(key)
          })
          this.navCtrl.navigateRoot('/login');
        }, async err => {
          await this.loaginInstence.dismiss();
          this.alertService.presentAlert('', this.translateService.getTranslatedData('Error while logging out'))
        }
      )

    }
  }


  private _initTranslate() {
    this.translate.setDefaultLang('en');
    this.storage.get('lang').then((val: string) => {
      console.log("Language from storage", val);

      this.translate.use(val !== null ? val : 'en'); // Set your language here
      this.translate.currentLang === "ar" ? document.body.style.setProperty('--direction', 'rtl') : document.body.style.setProperty('--direction', 'ltr')
      this.translate.currentLang === "ar" ? document.body.style.setProperty('--rotation', '180deg') : document.body.style.setProperty('--rotation', '0deg')
    })

  }

  public setAppSrcForFirstLogin(appSrc: string): void {
    this.appSrc = appSrc
  }


  public async onLogoutClick() {
    let alert = await this.alertController.create({
      subHeader: this.translateService.getTranslatedData("Are you sure you want to quit the app?"),
      buttons: [
        {
          text: this.translateService.getTranslatedData("No"),
          role: 'cancel',
          handler: () => { }
        }, {
          text: this.translateService.getTranslatedData("Yes"),
          role: 'success',
          handler: () => {
            this.logOut()
          }
        }
      ]
    })
    return organizationFile.appBundleId === "com.aqaraty.fm" ? await alert.present() : this.logOut()
  }
}
