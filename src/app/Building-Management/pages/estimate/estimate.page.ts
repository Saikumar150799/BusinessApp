import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstimateService } from '../../services/estimate.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.page.html',
  styleUrls: ['./estimate.page.scss'],
})
export class EstimatePage implements OnInit {

  public estimateId: any;
  estimate: any = {};
  public estimateToBeUpdated = {};

  constructor(
    private route: ActivatedRoute,
    private estimateService: EstimateService,
    private alertService: AlertServiceService,
    private loadingCtrl: LoadingController
  ) {

    this.route.queryParamMap.subscribe((params: any) => {
      this.presentLoading();
      this.getEstimateById(params.params.estimateId);
    });
  }

  ngOnInit() {
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return await loading.present();
  }

  getEstimateById(id) {
    this.estimateService.getEstimateById(id).subscribe((data) => {
      console.log(data);
      this.estimate = data;
      this.loadingCtrl.dismiss();
    }, err => {
      this.alertService.presentAlert('Error', JSON.stringify(err));
    });
  }

  async updateEstimate() {
    this.estimateToBeUpdated = Object.assign({}, this.estimate);
    this.estimateService.updateEstimate(this.estimateToBeUpdated).subscribe((data) => {
      console.log(data);
    });
  }

}
