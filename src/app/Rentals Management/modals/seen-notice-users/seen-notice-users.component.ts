import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NoticeService } from '../../services/notice.service';
import { ThrowStmt } from '@angular/compiler';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-seen-notice-users',
  templateUrl: './seen-notice-users.component.html',
  styleUrls: ['./seen-notice-users.component.scss'],
})
export class SeenNoticeUsersComponent implements OnInit {

  @Input() id: string;

  public seenByData: any = {
    seenBy: []
  };
  private loaginInstence: HTMLIonLoadingElement;

  constructor(
    private noticeService: NoticeService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertService: AlertServiceService,
    public translationService: translateService
  ) { }

  ngOnInit() {
    this.getNoticeDetails();
  }

  public async presentLoading() {
    this.loaginInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loaginInstence.present();
  }

  public closeButtonClick() {
    this.modalCtrl.dismiss();
  }

  public async getNoticeDetails() {
    await this.presentLoading();
    this.noticeService.getSeenUserById(this.id).subscribe((data: any) => {
      console.log(data);
      this.seenByData = data;

      this.loaginInstence.dismiss();

    }, () => {
      this.alertService.presentAlert('', 'Something went wrong please try again');

      this.loaginInstence.dismiss();
    });
  }

}
