import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NoticeCreatePage } from '../notice-create/notice-create.page'
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.page.html',
  styleUrls: ['./notice-board.page.scss'],
})
export class NoticeBoardPage implements OnInit {

  notices: any[] = [];
  disableInfiniteScroll = false;

  filterData: any = {
    skip: 0
  };
  public displayEmptyString: boolean = false

  constructor(
    private noticeService: NoticeService,
    private loading: LoadingController,
    private modalController: ModalController,
    private alertService: AlertServiceService,
    public transService: translateService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.filterData.skip = 0
    this.notices = [];
    this.disableInfiniteScroll = false
    this.getNoices('');

  }

  async presentLoading() {
    await this.loading.create({
      spinner: "lines"

    }).then(loading => {
      loading.present();
    });
  }

  async getNoices(event) {

    if (!event) {
      await this.presentLoading();
    }
    this.noticeService.getNotices(this.filterData)
      .subscribe((data: any) => {

        this.notices = this.notices.concat(data.data.data);
        this.filterData.skip = data.data.query.skip + 5;

        console.log(this.notices);

        event ? event.target.complete() : this.loading.dismiss();

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
        }
        this.displayEmptyString = this.notices.length === 0 ? true : false
      },
        async err => {
          await this.loading.dismiss();
          console.log(err);

          if (err.error == "You don't have permission for this operation!") {
            this.alertService.presentAlert('', "You don't have permission for this operation!")
            this.router.navigateByUrl('building-management-home')
          } else {
            this.alertService.presentAlert("", err.error.error);
          }
        }
      );
  }

  changeLikeIcon(id) {
    this.notices.map((item) => {
      if (item._id === id) {
        item.hasLiked = !item.hasLiked;
        if (item.hasLiked === false) {
          item.likesCount = item.likesCount - 1;
        } else if (item.hasLiked === true) {
          item.likesCount = item.likesCount + 1;
        }

      }
    });
  }

  async openCreateNoticeModal() {
    let modal = await this.modalController.create({
      component: CreateNoticeComponent
    })
    modal.onDidDismiss().then((data) => {
      if (data.data === true) {
        console.log(data.data);
        this.notices = [];
        this.filterData.skip = 0;
        this.getNoices('');
      }
    })
    return await modal.present();
  }

  stopEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  async likeDiscussion(id) {
    await this.presentLoading();

    this.noticeService.likeNotice(id)
      .subscribe((data: any) => {
        this.changeLikeIcon(id);
        this.loading.dismiss();
      },
        err => {
          this.loading.dismiss();
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  async openNoticeCreateModal() {
    const modal = await this.modalController.create({
      component: NoticeCreatePage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
