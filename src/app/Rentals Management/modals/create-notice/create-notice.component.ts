import { Router, ActivatedRoute } from "@angular/router";
import { NoticeService } from "./../../services/notice.service";
import {
  ModalController,
  LoadingController,
  ActionSheetController,
} from "@ionic/angular";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { ProjectSearchPage } from "../../pages/project-search/project-search.page";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { PictureComponent } from "src/app/common-components/picture/picture.component";

@Component({
  selector: "app-create-notice",
  templateUrl: "./create-notice.component.html",
  styleUrls: ["./create-notice.component.scss"],
})
export class CreateNoticeComponent implements OnInit {
  notice: any = {
    discussionBelongsTo: "Project",
    discussionType: "Notice",
    raisedByEmployee: true,
    selectedProjects: [],
  };
  flag = false;
  public images: any[] = [];
  public files: any[] = [];
  private loaginInstence: HTMLIonLoadingElement;
  constructor(
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private noticeService: NoticeService,
    private router: Router,
    private alertService: AlertServiceService,
    private route: ActivatedRoute,
    public webView: WebView,
    public transService: translateService,
    private actionSheet: ActionSheetController,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  async presentLoading() {
    this.loaginInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loaginInstence.present();
  }
  async closeModal() {
    await this.modalController.dismiss();
  }

  async openProjectSearchModal() {
    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        // id: this.notice.discussionBelongsToRefId,
        // name: this.notice.noticeBelongsToName
        selectedProjects: this.notice.selectedProjects,
      },
    });

    modal.onDidDismiss().then((project: any) => {
      console.log(project);
      if (project !== null && project.data) {
        this.notice.selectedProjects = project.data.projectList;
        this.notice.noticeBelongsToName = `${
          project.data.projectList.length
        } ${this.transService.getTranslatedData("projects selected")}`;
      } else {
        this.notice.selectedProjects = [];
        delete this.notice.noticeBelongsToName;
      }
    });

    return await modal.present();
  }

  async createNotice() {
    // tslint:disable-next-line: no-unused-expression
    this.notice.discussionBelongsTo === "All Projects"
      ? (delete this.notice.discussionBelongsToRefId,
        delete this.notice.noticeBelongsToName)
      : delete this.notice.noticeBelongsToName;

    await this.presentLoading();
    if (this.images.length > 0) {
      this.notice.files = this.files;
    }
    this.noticeService.createNotice(this.notice).subscribe(
      (data: any) => {
        this.loaginInstence.dismiss();
        this.alertService.presentAlert(
          "",
          this.transService.getTranslatedData("create-notice.notice-created")
        );
        this.flag = true;
        this.modalController.dismiss(this.flag);
        this.router.navigateByUrl("/rentals-notice-board");
      },
      (err) => {
        this.loaginInstence.dismiss();
        this.alertService.presentAlert("", err.error.error);
      }
    );
  }

  async fileSourceOption(type: string) {
    if (this.images.length < 1) {
      const caller = await this.alertService.capturePhoto(type);
      if (caller) {
        console.log(caller);
        this.presentLoading();
        this.images.push(caller);
        this.alertService.getPutSignedUrl(caller).subscribe(
          (res) => {
            console.log(res);
            this.alertService
              .s3BucketFileTransfer(caller, res.url)
              .then(() => {
                this.files.push(res);

                this.loaginInstence.dismiss();
              })
              .catch(() => {
                this.loaginInstence.dismiss();
              });
          },
          (err) => {
            this.loaginInstence.dismiss();
          }
        );
        this.changeDetector.detectChanges();
      }
    } else {
      this.alertService.presentAlert(
        "",
        "You cannot upload more than one image"
      );
    }
  }

  removeImage() {
    this.images = [];
    this.files = [];
  }
  dismiss() {
    this.modalController.dismiss(this.flag);
  }

  public presentActionSheet() {
    this.actionSheet
      .create({
        header: `${this.transService.getTranslatedData("Select image from")}`,
        buttons: [
          {
            text: `${this.transService.getTranslatedData("Camera")}`,
            icon: "camera",
            handler: async () => {
              this.fileSourceOption("camera");
            },
          },
          {
            text: `${this.transService.getTranslatedData("Library")}`,
            icon: "images",
            handler: () => {
              this.fileSourceOption("library");
            },
          },
          {
            text: `${this.transService.getTranslatedData("Cancel")}`,
            icon: "close",
            handler: () => {
              console.log("cancel");
            },
          },
        ],
      })
      .then((actionsheet) => {
        actionsheet.present();
      });
  }

  public openImage(image: string) {
    this.modalController
      .create({
        component: PictureComponent,
        componentProps: { image },
      })
      .then((modal) => {
        modal.present();
      });
  }
}
