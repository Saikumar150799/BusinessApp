import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { EstimateService } from '../../services/estimate.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as orgFile from '../../../conatants/organization.json'
@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.page.html',
  styleUrls: ['./estimate.page.scss'],
})
export class EstimatePage implements OnInit {

  public estimateId: any;
  estimate: any = {};
  public estimateToBeUpdated = {};
  public orgFile: any = orgFile;
  private loadingInstence: HTMLIonLoadingElement;

  constructor(
    private route: ActivatedRoute,
    private estimateService: EstimateService,
    public alertService: AlertServiceService,
    private loadingCtrl: LoadingController,
    public translateService: translateService
  ) {

    this.route.queryParamMap.subscribe((params: any) => {
      this.presentLoading();
      this.getEstimateById(params.params.estimateId);
    });
  }

  ngOnInit() {
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines',
    });
    await this.loadingInstence.present();
  }

  getEstimateById(id) {
    this.estimateService.getEstimateById(id).subscribe(async (data) => {
      console.log(data);
      this.estimate = data;

      this.loadingInstence.dismiss();

    }, async err => {

      this.loadingInstence.dismiss();

      this.alertService.presentAlert('Error', 'something went wrong please try again');
    });
  }

  async updateEstimate() {
    this.estimateToBeUpdated = Object.assign({}, this.estimate);
    this.estimateService.updateEstimate(this.estimateToBeUpdated).subscribe((data) => {
      console.log(data);
    });
  }

}
