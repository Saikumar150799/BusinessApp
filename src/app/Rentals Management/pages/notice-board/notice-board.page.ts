import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NoticeCreatePage } from '../notice-create/notice-create.page'
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { CreateNoticeComponent } from '../../modals/create-notice/create-notice.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { Router } from '@angular/router';
import { SeenNoticeUsersComponent } from '../../modals/seen-notice-users/seen-notice-users.component';
import { SelectedProjectListComponent } from '../../modals/selected-project-list/selected-project-list.component';

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.page.html',
  styleUrls: ['./notice-board.page.scss'],
})
export class NoticeBoardPage implements OnInit {

  notices: any[] = [];
  disableInfiniteScroll = true;

  filterData: any = {
    page: 1,
    limit: 5
  };
  public moduleAccess: any = { noticeBoard: { access: true, read: true, create: true, update: true, delete: true } }
  public displayEmptyString: boolean = false;
  private loadingInstence: HTMLIonLoadingElement;
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
    this.notices = [];
    this.disableInfiniteScroll = true;
    this.filterData.page = 1;
    this.getNoices('');

  }

  public async presentLoading() {
    this.loadingInstence = await this.loading.create({
      spinner: "lines"
    });
    await this.loadingInstence.present();
  }

  async getNoices(event) {

    if (!event) {
      await this.presentLoading();
    }
    await this.alertService.getDataFromLoaclStorage('moduleAccess').then(async (val: any) => {
      this.moduleAccess = JSON.parse(val);
    });
    this.noticeService.getNotices(this.filterData)
      .subscribe((data: any) => {
        if (data.count > 0) {
          this.notices = this.notices.concat(data.rows)
        }
        this.filterData.page += 1;
        console.log(this.filterData.page);

        event ? event.target.complete() : this.loadingInstence.dismiss();

        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.disableInfiniteScroll = true;
        } else {
          this.disableInfiniteScroll = false;
        }
        this.displayEmptyString = this.notices.length === 0 ? true : false
      },
        async err => {
          await this.loadingInstence.dismiss();
          console.log(err);

          if (err.error == "You don't have permission for this operation!") {
            this.alertService.presentAlert('', "You don't have permission for this operation!")
            this.router.navigateByUrl('rentals-home')
          } else {
            this.alertService.presentAlert("", err.error.message);
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
        this.filterData.page = 1;
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
        this.loadingInstence.dismiss();
      },
        err => {
          console.log(err);

          this.loadingInstence.dismiss();
          this.alertService.presentAlert("",
            err.message ? err.message : 'something went wrong please try again later');
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


  public presentSeenUserModal(id: string) {
    this.modalController.create({
      component: SeenNoticeUsersComponent,
      componentProps: { id }
    }).then(modal => {
      modal.present();
    });
  }

  public presentNoticeListModal(id: string) {
    this.modalController.create({
      component: SelectedProjectListComponent,
      componentProps: { id }
    }).then(modal => {
      modal.present();
    });
  }

}
