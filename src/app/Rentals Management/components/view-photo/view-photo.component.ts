import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Device } from '@ionic-native/device/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss'],
})
export class ViewPhotoComponent implements OnInit {

  @Input() images;
  public photos = [];
  constructor(
    public transService: translateService,
    public modalCtrl: ModalController,
    public webview: WebView,
    public domSanatice: DomSanitizer,
    public device: Device,
    public file: File
  ) { 
   
  }

  ngOnInit() {
    this.getPhotos()
  }
  getPhotos(){
    let win: any = window; 
    setTimeout(()=>{
      if(this.images && this.images.length > 0){
        this.images = this.images.map( (img) => {
          return win.Ionic.WebView.convertFileSrc(img);
        })
      }
    },500)
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
