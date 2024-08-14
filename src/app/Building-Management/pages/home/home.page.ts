import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { LoadingController, ModalController, AlertController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx'
import * as moment from 'moment';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Storage } from '@ionic/storage';
import { BuildingUserService } from '../../services/building-user.service';
import { Device } from '@ionic-native/device/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import * as jsonFile from '../../../conatants/organization.json';
// import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userDetails: any;
  ticketStats: any;
  public routing = jsonFile.HomePageRouting;


  public loading: boolean = true;
  options: PushOptions = {
    android: {},
    ios: {
    },
  }

  pushObject: PushObject;

  registrationId: string;

  constructor(
    private ticketService: TicketService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private userService: BuildingUserService,
    private alertService: AlertServiceService,
    private push: Push,
    public transService: translateService,
    private storage: Storage,
    private device: Device,
    private alertCtrl: AlertController,
    private _navCtrl: NavController,
    private platform: Platform,
    // private oneSignal: OneSignal
  ) {


    this.platform.ready().then(() => {
      this.device.platform ?
        this.device.platform.toLowerCase() === 'android' ?
          this.pushObject = this.push.init(this.options)
          : console.log('No android platform platform available!!!')
        : console.log('No platform available!!!');

      if (this.device.platform) {
        this.device.platform.toLowerCase() === 'ios'
          ? this.implementOneSignal()
          : this.implementPhonegapPushPlugin();
      } else {
        console.log('No platform available!!!');
        this.getUserDetails();
      }
    });
  }


  async presentLoading() {
    await this.loadingCtrl.create({
      spinner: 'lines'
    }).then(loading => {

      loading.present();
    });
  }
  ionViewDidEnter() {
    this.loading == true ? this.presentLoading() : '';
    this.getTicketStats();
  }

  async ngOnInit() {
  }

  async openCreateNoticeModal() {

    let modal = await this.modalController.create({
      component: CreateNoticeComponent,
    })
    return await modal.present();
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
          id: '',
          pushToken: this.registrationId,
          fcmToken: true,
          deviceId: this.device.uuid,
          platform: this.device.platform ? this.device.platform.toLowerCase() : '',
          newApp: true
        };
        console.log('After', this.userDetails);

        this.pushNotifications();

        if (this.userDetails.firstName) {
          window.localStorage.setItem('firstName', this.userDetails.firstName)
          this.storage.set('firstName', this.userDetails.firstName)

        }

        if (this.userDetails.lastName) {
          window.localStorage.setItem('lastName', this.userDetails.lastName)
          this.storage.set('lastName', this.userDetails.lastName)
        }

        window.localStorage.setItem('organization', this.userDetails.organization);
        this.storage.set('organization', this.userDetails.organization);

        window.localStorage.setItem('email', this.userDetails.email);
        this.storage.set('email', this.userDetails.email);
      },
        err => {
          console.log('error getting user details');
        }
      );


  }


  async presentAlert(header: string) {
    await this.alertCtrl.create({
      header: header,
      // message: message,
      cssClass: 'notifivation-alert',
      buttons: [{
        text: 'OK',
        cssClass: 'width-100-percent alert-button-inner.sc-ion-alert-md',
      }]
    }).then(alert => {
      alert.present()
    })
  }


  navigate(path) {
    if (path === '-create-notice') {
      this.openCreateNoticeModal();
    } else {

      this.router.navigateByUrl(`/${window.localStorage.getItem('appSrc')}${path}`);
    }
  }

  async getTicketStats() {
    this.ticketService.getTicketStats()
      .subscribe(async (data: any) => {
        this.loading == true ? await this.loadingCtrl.dismiss() : '';
        this.loading = false
        this.ticketStats = data;
        console.log(this.ticketStats);
      },
        err => {
          this.loading == true ? this.loadingCtrl.dismiss() : '';
          this.alertService.presentAlert("", err.error.error);
        }
      );
  }

  pushNotifications() {
    if (this.registrationId) {
      this.userService.updateUser(this.userDetails).subscribe((data) => {
        console.log("********** User Updated **********");
        console.log("********** User Updated **********");

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
      const { text } = barcodeData;
      console.log("--------++----------")
      console.log(text)
      console.log("---------++---------")

      if (!text) {
        this.loading == true ? this.loadingCtrl.dismiss() : '';
        this.alertService.presentAlert("", 'Invalid barcode');
      } else {
        this.loading == true ? await this.presentLoading() : '';
        this.ticketService.searchAssert(text)
          .subscribe(async (data: any) => {
            this.loading == true ? this.loadingCtrl.dismiss() : '';
            await this.alertCtrl.create({
              header: data.name,
              message: `
            <b>AssertId:-</b>${data.assetId || 'N/A'}<br/>

            <b>Category:-</b> ${data.category || 'N/A'}<br/>
            
            <b>Location:-</b> ${data.location || 'N/A'}<br/>
            
            <b>Floor:-</b> ${data.floor || 'N/A'}<br/>
            
            <b>Description:-</b> ${data.description || 'N/A'}`,
              buttons: [
                {
                  text: 'Scan Again',
                  role: 'cancel',
                  handler: () => {
                    this.openScanner()
                  }
                },
                {
                  text: 'Confirm',
                  role: 'ok',
                  handler: () => {
                    this.router.navigate([`${window.localStorage.getItem('appSrc')}-tickets`], {
                      queryParams: {
                        id: data._id,
                        name: data.assetId
                      }
                    })
                  }
                }]
            }).then(alert => {
              alert.present()
            })

            console.log(data);
          },
            err => {
              this.loading == true ? this.loadingCtrl.dismiss() : '';
              this.alertService.presentAlert("", err.error.message);
            }
          );
      }
    })
  }



  public implementOneSignal() {
    // this.oneSignal.startInit(jsonFile.oneSignalAppId);
    // this.oneSignal.handleNotificationOpened().subscribe((data) => {
    //   this.handlePushNotification(data.notification.payload.additionalData, { title: data.notification.payload.title, message: data.notification.payload.body });
    // });
    // this.oneSignal.handleNotificationReceived().subscribe((data) => {
    //   this.handlePushNotification(data.payload.additionalData, { title: data.payload.title, message: data.payload.body });
    // });
    // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    // this.oneSignal.endInit();
    // this.oneSignal.getIds().then((res: any) => {
    //   console.log('-------------Registration Res For OneSignal-----------------');
    //   console.log(res);
    //   this.registrationId = res.userId;
    //   this.getUserDetails();
    // });
  }



  public implementPhonegapPushPlugin() {
    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('---------- registrations ---------');
      console.log(JSON.stringify(registration), null, 2);
      this.registrationId = registration.registrationId;
      this.getUserDetails();
    });

    this.pushObject.on('notification').subscribe((notification: any) => {
      this.loading = false;
      console.log(notification);

      this.handlePushNotification(notification.additionalData, { title: notification.title, message: notification.message })
    });
  }



  public handlePushNotification(additionalData, data: { title: string, message: string }) {
    if (additionalData.type == 'discussion') {
      this.presentAlert(`${data.title} ${data.message}`)
      console.log('discussion');
      if (additionalData.id) {
        console.log('discussion with id');
        this._navCtrl.navigateForward(`/building-management-notice-details`, {
          queryParams: {
            did: additionalData.id
          }
        });
      } else {
        console.log('discussion without id');
        this._navCtrl.navigateForward(`/building-management-notice-board`);
      }
    } else if (additionalData.type == 'ticket') {
      this.presentAlert(data.title)
      if (additionalData.id) {
        this._navCtrl.navigateForward(`/building-management-ticket-details`, {
          queryParams: {
            ticketId: additionalData.id
          }
        });
      } else {
        this._navCtrl.navigateForward('/building-management-tickets');
      }
    }
  }

}
