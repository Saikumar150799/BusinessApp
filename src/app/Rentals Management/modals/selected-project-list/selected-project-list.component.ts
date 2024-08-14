import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { NoticeService } from '../../services/notice.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-selected-project-list',
  templateUrl: './selected-project-list.component.html',
  styleUrls: ['./selected-project-list.component.scss'],
})
export class SelectedProjectListComponent implements OnInit {

  @Input() id: string;
  private loadingInstence: HTMLIonLoadingElement;
  public projectList: Array<any>;
  constructor(
    private noticeService: NoticeService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertService: AlertServiceService,
    public transService: translateService
  ) { }

  ngOnInit() {
    this.getNoticeDetails();
  }

  public async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: 'lines'
    });
    await this.loadingInstence.present();
  }

  public closeButtonClick() {
    this.modalCtrl.dismiss();
  }

  public async getNoticeDetails() {
    await this.presentLoading();
    this.noticeService.getNoticeById(this.id).subscribe((data: any) => {
      this.projectList = data.selectedProjects;

      this.loadingInstence.dismiss();


    }, () => {
      this.alertService.presentAlert('', 'Something went wrong please try again');

      this.loadingInstence.dismiss();

    });
  }

}
