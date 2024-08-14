import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Storage } from '@ionic/storage';
import { BuildingUserService } from '../../services/building-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user_id = window.localStorage.getItem('user_id');
  public token = window.localStorage.getItem('token');
  public data: any = {};
  constructor(
    private router: Router,
    private userService: BuildingUserService,
    private alertService: AlertServiceService,
    private loadingCtrl: LoadingController,
    public transService: translateService,
    private storage: Storage,
    private navCtrl: NavController
  ) {
    this.getProfile(window.localStorage.getItem('user_id'));
  }

  ngOnInit() {
    console.log(this.user_id);
  }

  getProfile(id) {
    this.userService.getUserById(id).subscribe(data => {
      this.data = data;
      console.log(data);
    }, error => {
      this.alertService.presentAlert("",
        error.message.message);
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return await loading.present();
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
        await this.loadingCtrl.dismiss()
        window.localStorage.clear();
        await this.alertService.emptyStorage()
        this.navCtrl.navigateRoot('/login');
      }
    })
  }


  async updateUser(data) {
    this.userService.updateUser(data).subscribe(
      async (data: any) => {
        await this.loadingCtrl.dismiss()
        window.localStorage.clear();
        await this.storage.clear()
        this.navCtrl.navigateRoot('/login');
      }, async err => {
        await this.loadingCtrl.dismiss()
        this.alertService.presentAlert('', 'Error while logging out')
      })
  }

}
