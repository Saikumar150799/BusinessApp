import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController, PopoverController, Platform, MenuController, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from '../../services/rentals-user.service';
import { Device } from '@ionic-native/device/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from '../../components/language/language.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import * as jsonFile from '../../../conatants/organization.json';
import { Subscription } from 'rxjs';
import  OneSignal  from 'onesignal-cordova-plugin';
import { LoginService } from 'src/app/common-services/login.service';
import { StorageService } from 'src/app/common-services/storage-service.service';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: any;
  ticketStats: { ticket: any, todo: Array<any> } = { ticket: {}, todo: [] };
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public interfaceOptions: any = {
    cssClass: 'ticket-search-popover',
  };
  public showprogressLoader: boolean = false;
  public app: string = jsonFile.appBundleId;
  public routing = jsonFile.HomePageRouting;
  public borderClass = jsonFile.borderClass;
  private loadingInstence: HTMLIonLoadingElement;
  public loading: boolean = true;
  public totalTaskForToday = 0;
  public ticketAPICalled: boolean = false;
  public checkInCount: number = 0;
  public checkOutCount: number = 0;
  public startDate = new Date(new Date(new Date()).setHours(0,0,0,0)).toISOString();
  public endDate = new Date(new Date(new Date()).setHours(23,59,59,999)).toISOString();
  public ticketListFilterData: any = {
    limit: 10,
    page: 1,
    searchText:'',
    ticketBelongsTo: 'ticketBelongsTo=Home&ticketBelongsTo=Project&ticketBelongsTo=Facility',
    type: '',
    priority: '&priority=low&priority=high',
    status: 'status=open&status=in-progress',
  }
  public lang: string = '';
  options: PushOptions = {
    android: {},
    ios: {
      alert: 'true',
      badge: true,
      sound: 'true'
    },
  };
  public checkInCheckOutPayload = {
    date: moment(new Date()).toISOString(),
    type: '',
    page: 1,
    limit: 100,
    searchText: '',
  };
  public moduleAccess: any = {
    noticeBoard: { access: true, read: true, create: true, update: true, delete: true },
    tickets: { access: true, read: true, create: true, update: true, delete: true },
    workPermit: { access: true, read: true, create: true, update: true, delete: true },
    gatePass: { access: true, read: true, create: true, update: true, delete: true },
    other: {}
  }
  public deviceState;
  private backButtonSub: Subscription;

  private pushObject: PushObject;

  registrationId: string;

  public organizationType: string = '';
  public excludedModules = ['gatepass', 'workpermit'];

  constructor(
    private ticketService: TicketService,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private userService: RentalsUserService,
    private alertService: AlertServiceService,
    private push: Push,
    public transService: translateService,
    private storage: Storage,
    private device: Device,
    private alertCtrl: AlertController,
    private _navCtrl: NavController,
    private popover: PopoverController,
    private translateService: TranslateService,
    private changeDetector: ChangeDetectorRef,
    private splashScreen: SplashScreen,
    private platform: Platform,
    private menuCtrl: MenuController,
    // private oneSignal: OneSignal, 
    private loginservice: LoginService,
    private storageService: StorageService,
    private appSetting: MainAppSetting,
    public checkInCheckoutService: CheckInCheckOutService
  ) {
    this.platform.ready().then(async () => {
      await this.alertService.getDataFromLoaclStorage('moduleAccess').then((val: any) => {
        this.moduleAccess = JSON.parse(val);
      });
      // this.device.platform ?
      //   this.device.platform.toLowerCase() === 'android' ?
      //     this.pushObject = this.push.init(this.options)
      //     : console.log('No android platform platform available!!!')
      //   : console.log('No platform available!!!');
      
      if (this.device.platform) {
         
        // this.device.platform.toLowerCase() === 'ios'
          // ? this.implementOneSignal()
          // : this.implementPhonegapPushPlugin();
          this.implementOneSignal();
      } else {
        console.log('No platform available!!!');
        this.getUserDetails();


      }
    });

  }


  async presentLoading() {

    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.refreshToken();
      this.getCheckInCount();
      this.getCheckOutCount();
    }, 500);
    // this.backButtonSub = this.platform.backButton.subscribeWithPriority(0, () => {
    //   this.goBack();
    // });
  }

  async ngOnInit() {
    this.presentLoading();
    this.ticketListFilterData.startDate = `&startDate=${moment((new Date(new Date().setHours(0, 0, 0, 0))).toJSON()).format('YYYY-MM-DD')}`;
    this.ticketListFilterData.endDate = `&endDate=${moment((new Date(new Date().setHours(23, 59, 59, 999))).toJSON()).format('YYYY-MM-DD')}`;
    this.alertService.getDataFromLoaclStorage('lang').then((val: string) => {
      val ? this.lang = val : this.lang = 'en';
    });

    await this.storageService.getDatafromIonicStorage('organizationType').then((data) => {
      this.organizationType = data
    })

    if(this.organizationType !== 'residential') {
      this.routing = this.routing.filter(route => !this.excludedModules.includes(route.ModuleName.toLowerCase()));
    }
    // this.loadingInstence.dismiss();
  }

  getCheckInCount(){
    this.checkInCheckOutPayload.type = 'upcoming';
    this.checkInCheckoutService.getCheckInLists(this.checkInCheckOutPayload).subscribe((data: any)=>{
      this.checkInCount = data.rows.length;
    },(err)=>{
      console.log("Error",err);
      this.alertService.presentAlert('', err.error.message);
    })
  }

  getCheckOutCount(){
    this.checkInCheckOutPayload.type = 'checkout_pending';

    this.checkInCheckoutService.getCheckOutUnits(this.checkInCheckOutPayload).subscribe((data: any)=>{
      this.checkOutCount = data.rows.length;
    },(err)=>{
      console.log("Error",err);
      this.alertService.presentAlert('', err.error.message);
    })
  }


  public refreshToken() {
    this.userService.refreshToken().subscribe(data => {
      this.setValues(data);
    });
  }

  async setValues(data) {
    window.localStorage.setItem('user_id', data.uid);
    await this.storageService.storeDataToIonicStorage('user_id', data.uid);

    window.localStorage.setItem('token', data.token);
    await this.storageService.storeDataToIonicStorage('token', data.token);
    this.appSetting.setTokenAferLogin(data.token);

    window.localStorage.setItem('currencyCode', data.currencyCode);
    this.storageService.storeDataToIonicStorage('currencyCode', data.currencyCode);

    window.localStorage.setItem('organization', data.organization);
    this.storageService.storeDataToIonicStorage('organization', data.organization);

    window.localStorage.setItem('hasAccessToOnHoldTicket', JSON.stringify( data.role.onHoldTicket || false));
    this.storageService.storeDataToIonicStorage('hasAccessToOnHoldTicket', JSON.stringify( data.role.onHoldTicket || false));

    window.localStorage.setItem('hasAccessToReOpenedTicket', JSON.stringify(data.role.reOpenedTicket || false));
    this.storageService.storeDataToIonicStorage('hasAccessToReOpenedTicket', JSON.stringify(data.role.reOpenedTicket || false));

    window.localStorage.setItem('organizationType', data.organizationType || 'residential');
    this.alertService.saveToLocalStorage('organizationType', data.organizationType || 'residential');

    window.localStorage.setItem('ticketReject', data.role.moduleAddition && data.role.moduleAddition.ticketReject || false);
    this.alertService.saveToLocalStorage('ticketReject', data.role.moduleAddition && data.role.moduleAddition.ticketReject || false);

    window.localStorage.setItem('ticketConfig', JSON.stringify(data.organizationTicketConfig || {}));
    this.alertService.saveToLocalStorage('ticketConfig', JSON.stringify(data.organizationTicketConfig || {}));

    await this.storageService.getDatafromIonicStorage('moduleAccess').then(val => {
      val ? this.moduleAccess = JSON.parse(val) : '';
      console.log(this.moduleAccess)
    });

    data.role.module.other = {}

    this.moduleAccess = _.mapValues(this.moduleAccess, (module) => _.omit(module, 'id'));

    if (_.isEqual(this.moduleAccess, data.role.module)) {

      if(data.role.module && data.role.module.tickets && data.role.module.tickets.read) {

        this.ticketListFilterData.page = 1;

        this.getTicketStats();
        if (this.loading === true) {
          this.ticketStats.todo = [];
          this.getTickets('');
        }
      } else{ 
        this.loading === true ? this.loadingInstence.dismiss() : '';
      }
    }
    else {

      this.loading === true ? this.loadingInstence.dismiss() : '';
      this.changeRollAccess(data.role.module);
    }
  }

  async openCreateNoticeModal() {

    let modal = await this.modalController.create({
      component: CreateNoticeComponent,
    });
    return await modal.present();
  }

  async presentAlert(header: string) {
    await this.alertCtrl.create({
      header: header,
      // message: message,
      cssClass: 'notifivation-alert',
      buttons: [{
        text: this.transService.getTranslatedData('Ok'),
        cssClass: 'width-100-percent alert-button-inner.sc-ion-alert-md',
      }]
    }).then(alert => {
      alert.present();
    });
  }

  getRoundedTime() {
    const d = new Date();
    // alert(d)
    const ratio = d.getMinutes() / 60;
    // alert(ratio)
    // Past 30 min mark, return epoch at +1 hours and 0 minutes
    if (ratio > 0.5) {
      // alert((d.getHours() + 1) * 3600)
      return (d.getHours() + 1) * 3600;
    }
    // Return epoch at 30 minutes past current hour
    // alert((d.getHours() * 3600) + 1800)
    return (d.getHours() * 3600) + 1800;
  }

  getUserDetails() {
    this.userService.getUserById(window.localStorage.getItem('user_id'))
      .subscribe((data: any) => {
        this.userDetails = data;
        console.log(this.userDetails);

        this.userDetails.businessAppDevice = {
          // id: '',
          pushToken: this.registrationId,
          // fcmToken: true,
          deviceId: this.device.uuid,
          platform: this.device.platform ? this.device.platform.toLowerCase() : '',
          newApp: true
        };
        console.log('After', this.userDetails);


        if (this.userDetails.firstName) {
          window.localStorage.setItem('firstName', this.userDetails.firstName);
          this.storage.set('firstName', this.userDetails.firstName);

        }

        if (this.userDetails.lastName) {
          window.localStorage.setItem('lastName', this.userDetails.lastName);
          this.storage.set('lastName', this.userDetails.lastName);
        }

        window.localStorage.setItem('organization', this.userDetails.organization);
        this.storage.set('organization', this.userDetails.organization);

        window.localStorage.setItem('email', this.userDetails.email);
        this.storage.set('email', this.userDetails.email);

        this.pushNotifications();
      },
        err => {
          this.loading == true ? this.loadingInstence.dismiss() : '';
          console.log('error getting user details');
          if(err.error.message.toLowerCase().includes('token invalid')) {
            this.alertService.presentInvalidTokenAlert();
          };
        }
      );


  }

  navigate(path, type) {
    if (path === '-create-notice') {
      this.openCreateNoticeModal()
    } else {

      const queryParams = type ? { type: type } : null;

      this.router.navigate([`/${window.localStorage.getItem('appSrc')}${path}`], {queryParams});
    }
  }

  async getTicketStats() {

    this.ticketService.getTicketStats(this.ticketListFilterData)
      .subscribe(async (data: any) => {
        this.ticketStats.ticket = data.ticket;
      },
        async err => {
          this.alertService.presentAlert('', err.error.message);
        }
      );
  }


  async getTickets(event) {

    this.ticketService.getTickets(this.ticketListFilterData.page, this.ticketListFilterData.searchText, this.ticketListFilterData.status, this.ticketListFilterData.ticketBelongsTo, this.ticketListFilterData.type ? `&type=${this.ticketListFilterData.type}` : '', '', '', this.ticketListFilterData.startDate, this.ticketListFilterData.endDate, '', '', '', '', '', '', '')
      .subscribe(async (data: any) => {

        this.ticketStats.todo = this.ticketStats.todo.concat(data.rows);
        this.totalTaskForToday = data.count;
        this.ticketListFilterData.page += 1;

        if (event) {
          event.target.complete();
        } else {
          this.loading == true ? this.loadingInstence.dismiss() : '';
        }
        this.loading = false;
        this.ticketAPICalled = true;
        this.showprogressLoader = false;
        if (this.ticketListFilterData.page > Math.ceil(data.count / this.ticketListFilterData.limit)) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
        async err => {
          this.alertService.presentAlert('', err.error.message);
          this.showprogressLoader = false;
          this.loading == true ? this.loadingInstence.dismiss() : '';
        }
      );
  }

  pushNotifications() {
    if (this.registrationId) {
      this.userService.updateUser(this.userDetails).subscribe((data) => {
        // console.log(data);
        // alert('success');
      }, err => {
        // alert('Error')
        console.log(err);
      });
    }
  }

  async openScanner() {
    // Scann QR Code.'
    this.barcodeScanner.scan().then(async (barcodeData) => {
      console.log(barcodeData);
      await this.presentLoading();

      const { text } = barcodeData;
      if (!text) {

        this.loadingInstence.dismiss();
        return;
      }
      this.ticketService.searchAssert(text)
        .subscribe(async (data: any) => {

          this.loadingInstence.dismiss()

          const scannedData = data.rows[0]
          data.rows.length > 0 ?
            await this.displayAssetAlert(data, scannedData) :
            this.alertService.presentAlert('', 'Asset not found')

        },
          async err => {

            this.loadingInstence.dismiss();

            this.alertService.presentAlert('', 'Asset not found');
          }
        );
    });
  }

  private async displayAssetAlert(data: any, scannedData: any) {
    await this.alertCtrl.create({
      header: data.name,
      message: `
            <b>${this.transService.getTranslatedData('Asset Id')}: </b>${scannedData.assetId ? scannedData.assetId : ''}<br/>

            <b>${this.transService.getTranslatedData('Category')}: </b> ${scannedData.category ? scannedData.category : ''}<br/>

            <b>${this.transService.getTranslatedData('Location')}: </b> ${scannedData.location ? scannedData.location : ''}<br/>

            <b>${this.transService.getTranslatedData('Floor')}: </b> ${scannedData.floor ? scannedData.floor : ''}<br/>

            <b>${this.transService.getTranslatedData('Description')}: </b> ${scannedData.description ? scannedData.description : ''}`,
      buttons: [
        {
          text: this.transService.getTranslatedData('Scan Again'),
          role: 'cancel',
          handler: () => {
            this.openScanner();
          }
        },
        {
          text: this.transService.getTranslatedData('Confirm'),
          role: 'ok',
          handler: () => {
            this.router.navigate([`${window.localStorage.getItem('appSrc')}-tickets`], {
              queryParams: {
                id: scannedData._id,
                name: scannedData.assetId
              }
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  public arabic(num: any) {   // ********** Used to convert number into different language using locale **********
    let x: number = parseInt(num);
    return x.toLocaleString('ar-EG');
  }


  async popOverOption() {
    console.log(this.lang);

    let popOver = await this.popover.create({
      component: LanguageComponent,
      event: event,
      mode: 'ios',
      componentProps: {
        lang: this.lang
      }
    });
    popOver.onDidDismiss().then(data => {
      if (data.data) {
        this.lang = data.data;
        this.changeLanguage(data.data);
      }
    });
    return await popOver.present();
  }


  public changeLanguage(lang: string) {
    console.log('finale code', this.lang);

    this.splashScreen.show();
    this.alertService.saveToLocalStorage('lang', lang);
    this.translateService.use(lang);
    lang === 'ar' ? document.body.style.setProperty('--direction', 'rtl') : document.body.style.setProperty('--direction', 'ltr');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  onTicketClick(id: string): void {
    console.log(id);

    this.router.navigate(['/rentals-ticket-details'], {
      queryParams: {
        ticketId: id
      }
    });
  }
  public async goBack() {
    const menu = await this.menuCtrl.getOpen();
    if (menu) {
      console.log('close menu');

      await menu.close();
    } else {
      this._navCtrl.pop();
      console.log(this.router.url);

      if (this.router.isActive('/rentals-Home', true) && this.router.url === '/rentals-Home') {

        // this.presentExitAlert();
      }
    }
  }

  presentExitAlert() {
    this.alertCtrl.create({
      header: this.transService.getTranslatedData('Do you want to exit?'),
      buttons: [
        {
          text: this.transService.getTranslatedData('Yes'),
          handler: () => {
            navigator['app'].exitApp();
          }
        },
        {
          text: this.transService.getTranslatedData('No'),
          handler: () => {
            console.log('user don\'t want to cancel app');

          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }


  public implementOneSignal() {
    // this.oneSignal.startInit(jsonFile.oneSignalAppId);
    // this.oneSignal.handleNotificationOpened().subscribe((data) => {
    //   // this.loadingInstence.dismiss();
    //   this.handlePushNotification(data.notification.payload.additionalData, { title: data.notification.payload.title, message: data.notification.payload.body });
    // });
    // this.oneSignal.handleNotificationReceived().subscribe((data) => {
    //   // this.loadingInstence.dismiss();
    //   this.handlePushNotification(data.payload.additionalData, { title: data.payload.title, message: data.payload.body });
    // });
    // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    // this.oneSignal.endInit();
    // this.oneSignal.getIds().then((res: any) => {
    //   console.log('-------------Registration Res For OneSignal-----------------');
    //   console.log(res);
    //   this.registrationId = res.userId;
    // });
    OneSignal.setAppId(jsonFile.oneSignalAppId);
    OneSignal.setNotificationOpenedHandler((data) => {
      this.handlePushNotification(data.notification.additionalData, { title: data.notification.title, message: data.notification.body });
    });
    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    //  OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
    //   console.log("User accepted notifications: " + accepted);
    //    OneSignal.getDeviceState((res => {
    //     console.log('-------------Registration Res For OneSignal-----------------');
    //     console.log(res);
    //     // this.userDetails.businessAppDevice.pushToken = res.userId
    //     // this.registrationId = res.userId;
    //     this.getUserDetails();
    //   }))
    // });
    OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
    console.log("User accepted notifications: " + accepted);
        OneSignal.getDeviceState((res)=>{
        console.log("Response",res);
        // this.registrationId = res.userId;
        // this.userDetails.businessAppDevice.pushToken = res.userId
        this.registrationId = res.userId;
        this.getUserDetails();
      });
  })
  }


  public implementPhonegapPushPlugin() {
    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('---------- registrations ---------');
      console.log(JSON.stringify(registration), null, 2);
      this.registrationId = registration.registrationId;
      this.getUserDetails();
    });

    this.pushObject.on('notification').subscribe((notification: any) => {
      // this.loadingInstence.dismiss();
      console.log(notification);

      this.handlePushNotification(notification.additionalData, { title: notification.title, message: notification.message })
    });
  }

  public handlePushNotification(additionalData, data: { title: string, message: string }) {
    if (additionalData.type == 'discussion') {
      this.presentAlert(`${data.title} ${data.message}`);
      console.log('discussion');
      if (additionalData.id) {
        console.log('discussion with id');
        this._navCtrl.navigateForward(`/rentals-notice-details`, {
          queryParams: {
            did: additionalData.id
          }
        });
      } else {
        console.log('discussion without id');
        this._navCtrl.navigateForward(`/rentals-notice-board`);
      }
    } else if (additionalData.type == 'comment') {
      this.presentAlert(`${data.title} ${data.message}`);
      console.log('discussion');
      if (additionalData.id) {
        console.log('discussion with id');
        this._navCtrl.navigateForward(`/rentals-notice-details`, {
          queryParams: {
            did: additionalData.id
          }
        });
      } else {
        console.log('discussion without id');
        this._navCtrl.navigateForward(`/rentals-notice-board`);
      }
    } else if (additionalData.eventType === 'ticket_create') {
      this.presentAlert(data.title);
      if (additionalData.id) {
        this._navCtrl.navigateForward(`/rentals-ticket-details`, {
          queryParams: {
            ticketId: additionalData.id
          }
        }); // $state.go('app.ticketdetails', { tid: data.additionalData.id })
      } else {
        this._navCtrl.navigateForward('/rentals-ticket-history');
      }
    } else if (additionalData.eventType === 'ticket_status_in_progress'
      || additionalData.eventType === 'ticket_status_resolved'
      || additionalData.eventType === 'ticket_status_rejected'
      || additionalData.eventType === 'ticket_job_date_alert'
      || additionalData.eventType === 'ticket_default_update'
      || additionalData.eventType === 'ticket_escalation'
      || additionalData.eventType === 'ticket_poc_change') {
      this.presentAlert(data.title);
      if (additionalData.id) {
        this._navCtrl.navigateForward(`/rentals-ticket-details`, {
          queryParams: {
            ticketId: additionalData.id
          }
        }); // $state.go('app.ticketdetails', { tid: data.additionalData.id })
      } else {
        this._navCtrl.navigateForward('/rentals-ticket-history');
      }
    } else if (additionalData.eventType === 'ticket_external_comment' || additionalData.eventType === 'ticket_internal_comment') {
      this.presentAlert(data.title);
      if (additionalData.id) {
        this._navCtrl.navigateForward(`/rentals-ticket-details`, {
          queryParams: {
            ticketId: additionalData.id,
            eventType: additionalData.eventType
          }
        }); // $state.go('app.ticketdetails', { tid: data.additionalData.id })
      } else {
        this._navCtrl.navigateForward('/rentals-ticket-history');
      }
    } else if(additionalData.eventType === "gatepass_created"){
      if(additionalData.eventType === 'gatepass_created' && additionalData.id){
        this.router.navigate(['/rentals-gatepas-details'],{queryParams: {gatePassId: additionalData.id}});
      }else {
        this.router.navigateByUrl(`/rentals-gatepass`);
      }
    }
    else if(additionalData.eventType === "work_permit_approved_push_notification" || additionalData.eventType === "work_permit_work_status_change" || additionalData.eventType === "work_permit_created"){
      if(additionalData.id){
        this.router.navigate(['/rentals-work-permit-details'],{queryParams: {workPermitId: additionalData.id}});
      }else {
        this.router.navigateByUrl(`/rentals-work-permit`);

      }
    }
  }

  public async changeRollAccess(data: any) {

    window.localStorage.setItem('moduleAccess', JSON.stringify(data));
    await this.alertService.saveToLocalStorage('moduleAccess', JSON.stringify(data));
    await this.alertCtrl.create({
      header: 'Your access role has changed',
      subHeader: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'ok', handler: () => {
            this.splashScreen.show();
            window.location.reload();
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });

  }

  public async filterTickets(type: string) {
    this.ticketListFilterData.page = 1;
    this.ticketAPICalled = false;
    this.infiniteScroll.disabled = true;
    this.ticketStats.todo = [];
    this.totalTaskForToday = 0;
    this.showprogressLoader = true
    this.getTickets('')
  }

  public refreshTickets() {
    this.infiniteScroll.disabled = true;
    this.loading = true;
    this.ticketListFilterData.page = 1;
    this.ticketAPICalled = false;
    this.ticketStats.todo = [];
    this.presentLoading();
    this.getTickets('')
  }

}
