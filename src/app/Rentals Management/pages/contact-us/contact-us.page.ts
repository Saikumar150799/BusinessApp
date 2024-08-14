import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ContactUsService } from '../../services/contact-us.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as jsonFile from '../../../conatants/organization.json';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  data: any = {
    data: {
      user: {},
      createdAt: new Date(),
      source: jsonFile.orgName
    }
  };

  public app: string = jsonFile.appBundleId;
  private loadingInstence: HTMLIonLoadingElement;
  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }

  constructor(
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private contactUsService: ContactUsService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertServiceService,
    public transService: translateService
  ) { }

  async ngOnInit() {
    await this.alertService.getDataFromLoaclStorage('user_id').then(val => {
      this.data.data.user._id = val;
    });

    await this.alertService.getDataFromLoaclStorage('countryCode').then(val => {
      this.data.data.user.countryCode = val;

    });
    await this.alertService.getDataFromLoaclStorage('phoneNumber').then(val => {
      this.data.data.user.phoneNumber = val;
    });
    await this.alertService.getDataFromLoaclStorage('firstName').then(val => {
      this.data.data.user.firstName = val;

    });
    await this.alertService.getDataFromLoaclStorage('lastName').then(val => {
      this.data.data.user.lastName = val;

    });

    await this.alertService.getDataFromLoaclStorage('email').then(val => {
      this.data.data.user.email = val;
    });

    await this.alertService.getDataFromLoaclStorage('organization').then(val => {
      this.data.data.organizations = val;
    });
  }

  async sendContactUsRequest() {

    await this.presentLoading();
    this.contactUsService.createContactUs(this.data).subscribe(async (data: any) => {
      this.loadingInstence.dismiss();
      await this.alertService.presentAlert('',
        this.transService.getTranslatedData('Thanks for your request. We will get back to you at the earliest.'));
      this.router.navigateByUrl('/rentals-home');
    },
      err => {
        this.loadingInstence.dismiss();
        console.log(err);
        this.alertService.presentAlert('', err.error.message);
      });
  }


  public call(number) {
    if (number) {
      window.location.href = 'tel:' + number;
    } else {
      this.alertService.presentAlert('',
        this.transService.getTranslatedData('Phone number not found'));
    }
  }

}
