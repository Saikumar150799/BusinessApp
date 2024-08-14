import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ActionSheetController } from '@ionic/angular';
import { ProjectSearchPage } from '../project-search/project-search.page';
import { NoticeService } from '../../services/notice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-notice-create',
  templateUrl: './notice-create.page.html',
  styleUrls: ['./notice-create.page.scss'],
})
export class NoticeCreatePage implements OnInit {

  notice: any = {
    discussionBelongsTo: 'Project',
    discussionType: 'Notice',
    raisedByEmployee: true,
  };
  public images: any[] = [];

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    return await loading.present();
  }

  constructor(
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private noticeService: NoticeService,
    private router: Router,
    private alertService: AlertServiceService,
    private route: ActivatedRoute,
    public transService: translateService,
    public webView: WebView,
    private actionSheet: ActionSheetController
  ) { }

  ngOnInit() {
  }

  async closeModal() {

    await this.modalController.dismiss();
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        id: this.notice.discussionBelongsToRefId,
        name: this.notice.noticeBelongsToName
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        console.log(project);
        this.notice.noticeBelongsToName = project.data.ticketBelongsToName;
        this.notice.discussionBelongsToRefId = project.data.ticketBelongsToRefId;
        console.log(this.notice);
      }
    });

    return await modal.present();
  }

  async createNotice() {
    await this.presentLoading();
    if (this.images.length > 0) {
      this.alertService.upload(this.images[0], this.notice, 'CREATENOTICE').then(() => {
        this.loadingCtrl.dismiss();
        this.alertService.presentAlert("",
          this.transService.getTranslatedData('create-notice.notice-created'));
        this.router.navigateByUrl('/building-management-notice-board');
      }).catch(async (err) => {
        await this.loadingCtrl.dismiss();
        this.alertService.presentAlert("", "Something went wrong");
      });
    } else {
      this.noticeService.createNotice(this.notice)
        .subscribe((data: any) => {
          this.loadingCtrl.dismiss();
          this.alertService.presentAlert("",
            this.transService.getTranslatedData('create-notice.notice-created'));
          this.router.navigateByUrl('/building-management-notice-board');
        },
          err => {
            this.loadingCtrl.dismiss();
            this.alertService.presentAlert("", err.error.error);
          }
        );
    }

  }

  public presentActionSheet() {
    this.actionSheet.create({
      header: 'Select image from ',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
            this.fileSourceOption('camera');
          }
        },
        {
          text: 'Library',
          icon: 'images',
          handler: () => {
            this.fileSourceOption('library');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          handler: () => {
            console.log('cancel');
          }
        }
      ]
    }).then(actionsheet => {
      actionsheet.present()
    })
  }

  async fileSourceOption(type) {

    if (this.images.length < 1) {
      let image_url;
      let caller = await this.alertService.capturePhoto(type);
      image_url = caller;
      console.log("in add-visitor Page\n\n");
      if (image_url != undefined) {
        console.log(image_url);
        this.images.push(image_url);
        console.log(this.images);
      }
    } else {
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('create-notice.picture-limit'))
    }
  }

  removeImage() {
    this.images = [];
  }

}
