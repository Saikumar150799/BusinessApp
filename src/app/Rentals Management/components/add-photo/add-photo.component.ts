import { Component, Input, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
})
export class AddPhotoComponent implements OnInit {
  @Input()item: any;
  public loadingInstence:HTMLIonLoadingElement
  public images = [];

  constructor(
    public transService: translateService,
    public actionSheet: ActionSheetController,
    public alertService: AlertServiceService,
    public loadingCtrl: LoadingController,
    public webView: WebView,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.getPhotos();
  }

  async getPhotos(){
    setTimeout(()=>{
      if(this.item.images && this.item.images.length > 0){
        this.images = this.item.images ;
      }
    },500)
    console.log("---------------------",this.images);
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  presentActionSheet() {
    this.actionSheet
      .create({
        header: `${this.transService.getTranslatedData("Select image from")}`,
        buttons: [
          {
            text: `${this.transService.getTranslatedData('Camera')}`,
            icon: 'camera',
            handler: async () => {
              this.fileSourceOption('camera');
            }
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

  async fileSourceOption(type: string) {
    const caller = await this.alertService.capturePhoto(type);
    if (caller) {
      console.log(caller);
      await this.presentLoading();
      this.images.push(caller);
      this.alertService.getPutSignedUrl(caller).subscribe(
        (res) => {
          this.item.handover.files.push(res._id);
          console.log(res);
          this.alertService
            .s3BucketFileTransfer(caller, res.url)
            .then(() => {
              this.loadingInstence.dismiss();
            })
            .catch(() => {
              this.loadingInstence.dismiss();
            });
        },
        (err) => {
          this.loadingInstence.dismiss();
        }
      );
    }
  }

  removeImage(index){
    this.images = this.images.filter((image,id) => id!=index);
    // this.item.handover.files = this.item.handover.files.filter((val,id)=> id!=index);
  }

  close(){
    this.modalController.dismiss();
  }

  save(){
    this.item.images = this.images;
    this.presentLoading();
    setTimeout(()=>{
      this.loadingCtrl.dismiss();
      this.modalController.dismiss(this.item, 'true')
    },500)
  }

}
