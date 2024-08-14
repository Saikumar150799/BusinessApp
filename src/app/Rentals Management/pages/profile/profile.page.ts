import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Storage } from '@ionic/storage';
import { RentalsUserService } from '../../services/rentals-user.service';
import * as organizationFile from '../../../conatants/organization.json'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user_id = window.localStorage.getItem('user_id');
  public token = window.localStorage.getItem('token');
  public data: any = {};
  public app: string = organizationFile.appBundleId
  private loadingInstence: HTMLIonLoadingElement;
  constructor(
    private router: Router,
    private userService: RentalsUserService,
    private alertService: AlertServiceService,
    private loadingCtrl: LoadingController,
    public transService: translateService,
    private alertController: AlertController,
    private storage: Storage,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.getProfile(window.localStorage.getItem('user_id'));
  }

  public async getProfile(id) {
    await this.presentLoading();
    this.userService.getUserById(id).subscribe(data => {
      this.data = data;
      this.loadingInstence.dismiss();
      console.log(data);
    }, error => {
      this.loadingInstence.dismiss();
      this.alertService.presentAlert("",
        error.message.message);
    });
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }


  async logOut() {
    let userId;
    await this.presentLoading();
    await this.alertService.getDataFromLoaclStorage('user_id').then(val => {
      userId = val;
    })
    this.userService.getUserById(userId).subscribe(async data => {
      if (data.businessAppDevice && data.businessAppDevice.pushToken) {
        delete data.businessAppDevice
        console.log(data);
        this.updateUser(data)
      } else {
        await this.loadingInstence.dismiss();
        window.localStorage.clear();
        await this.storage.forEach((value: string, key: string) => {
          key === 'lang' ? '' : this.storage.remove(key)
        })
        this.navCtrl.navigateRoot('/login');
      }
    })
  }


  async updateUser(data) {
    this.userService.updateUser(data).subscribe(
      async (data: any) => {
        await this.loadingInstence.dismiss();
        window.localStorage.clear();
        await this.storage.forEach((value: string, key: string) => {
          key === 'lang' ? '' : this.storage.remove(key)
        })
        this.navCtrl.navigateRoot('/login');
      }, async err => {
        await this.loadingInstence.dismiss();
        this.alertService.presentAlert('', 'Error while logging out')
      })
  }


  arabic(num: any) {   // ********** Used to convert number into different language using locale **********
    let x: number = parseInt(num)
    return x.toLocaleString('ar-EG')
  }


  public async onLogoutClick() {
    let alert = await this.alertController.create({
      subHeader: this.transService.getTranslatedData("Are you sure you want to quit the app?"),
      buttons: [
        {
          text: this.transService.getTranslatedData("No"),
          role: 'cancel',
          handler: () => { }
        }, {
          text: this.transService.getTranslatedData("Yes"),
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
