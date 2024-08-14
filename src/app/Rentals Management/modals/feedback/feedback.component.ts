import { Component, Input, OnInit } from '@angular/core';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { CheckInCheckOutService } from '../../services/ci-co/check-in-check-out.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  @Input() data;
  public formData: any = {
    star: 1
  };
  constructor(
    public transService: translateService,
    public CheckInCheckOutService: CheckInCheckOutService,
    public loadingCtrl: LoadingController,
    public alertService: AlertServiceService,
    public modalCtrl: ModalController
  ) { 
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
  }

  public async presentLoading(){
    const loader = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    return loader.present()
  }

  submitFeedback(){
    if(this.data && this.data.home){
      this.formData.home = this.data.home
    }
    this.presentLoading();
    this.CheckInCheckOutService.submitFeedBack(this.formData).subscribe((data: any)=>{
      this.loadingCtrl.dismiss();
      this.modalCtrl.dismiss();
    },(err)=>{
      this.alertService.presentAlert('', err.error.message || 'Something went wrong')
      this.loadingCtrl.dismiss();
      console.log(err);
    })
  }
}
