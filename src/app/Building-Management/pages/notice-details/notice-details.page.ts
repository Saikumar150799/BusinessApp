import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.page.html',
  styleUrls: ['./notice-details.page.scss'],
})
export class NoticeDetailsPage implements OnInit {

  notice: any = {};
  noticeId = '';
  comments: any[];
  user_id = '';

  constructor(
    private noticeService: NoticeService,
    private loading: LoadingController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      params.params.noticeId ? this.noticeId = params.params.noticeId : '';
      params.params.did ? this.noticeId = params.params.did : '';
      console.log(this.noticeId);
    });
    // this.user_id = window.localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.getNotice();
    this.getAllComments();
  }

  async presentLoading() {
    const loading = await this.loading.create({
    });
    await loading.present();
  }

  async getNotice() {

    this.presentLoading();
    let userId
    await this.alertService.getDataFromLoaclStorage('user_id').then(value => {
      userId = value;
      this.user_id = value;
    })
    this.noticeService.getNoticeById(this.noticeId)
      .subscribe((data: any) => {

        this.notice = data;
        this.notice.likes.indexOf(userId) > -1 ? this.notice.hasLiked = true : this.notice.hasLiked = false;
        console.log(this.notice);
        this.loading.dismiss();

      },
        err => {
          this.loading.dismiss();
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  getAllComments() {
    this.noticeService.getAllComments(this.noticeId)
      .subscribe((data: any) => {

        this.comments = data;
        console.log(this.comments);

      },
        err => {
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  changeLikeIcon(id) {

    this.notice.hasLiked = !this.notice.hasLiked;

    if (this.notice.hasLiked === false) {
      this.notice.likesCount = this.notice.likesCount - 1;
    } else if (this.notice.hasLiked === true) {
      this.notice.likesCount = this.notice.likesCount + 1;
    }

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

  async createComment() {

    const data = {
      text: this.notice.commentText,
      discussion: this.noticeId,
    };

    await this.presentLoading();
    this.noticeService.createComment(data)
      .subscribe((data: any) => {
        this.notice.commentText = '';
        this.loading.dismiss();
        this.getAllComments();
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loading.dismiss();
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  async deleteComment(id) {
    await this.presentLoading();
    this.noticeService.deleteComment(id)
      .subscribe((data: any) => {
        this.loading.dismiss();
        this.getAllComments();
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loading.dismiss();
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

}
