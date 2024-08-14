import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/common-services/login.service';
import { CountrycodemodalComponent } from 'src/app/login/countrycodemodal/countrycodemodal.component';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import * as jsonFile from '../../conatants/organization.json';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
// import { AlertserviceService } from 'src/app/common-services/alertservice.service';

@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss'],
})
export class NeedHelpComponent implements OnInit {

  public requestData: any = {
    countryCode: jsonFile.countryCode,
    orgName: jsonFile.orgName,
    appName: jsonFile.appName
  };
  private loginIntence: HTMLIonLoadingElement;

  // phoneNumber: 8528041001,
  // countryCode: '+965',
  // email: 'vishwash@thehousemonk.com',
  // comments: 'Test',
  // name: 'vishwash' }

  constructor(
    private modalCtrl: ModalController,
    private loginservice: LoginService,
    private loadingCtrl: LoadingController,
    private alertService: AlertServiceService,
    // tslint:disable-next-line: no-shadowed-variable
    public translateService: translateService
  ) { }

  ngOnInit() { }
  async presentLoading() {
    this.loginIntence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loginIntence.present();
  }
  async sendRequest() {
    console.log(this.requestData);

    await this.presentLoading();
    this.loginservice.needHelp(this.requestData).subscribe(async (data: any) => {
      await this.loginIntence.dismiss();
      this.modalCtrl.dismiss();
      this.alertService.presentAlert('', 'Thank you for your response, we will get back to you at the earliest');
    }, async err => {
      await this.loginIntence.dismiss();
      this.alertService.presentAlert('', this.translateService.getTranslatedData('something went wrong please try again'));

    });
    console.log(this.requestData);

  }

  async countryCodeModal() {
    await this.modalCtrl.create({
      component: CountrycodemodalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: { value: this.requestData.countryCode }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((data: any) => {
        this.requestData.countryCode = data.data ? data.data : this.requestData.countryCode;
        console.log(data.data, 'Data from country code modal');
      });
    });
  }
  close() {
    this.modalCtrl.dismiss();
  }

}
