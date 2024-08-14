import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  constructor(
    private _modalCtrl: ModalController,
    public translateService: translateService,
    public domSanatice: DomSanitizer,
    public device: Device
  ) { }
  @Input() image: any;

  ngOnInit() {

  }

  dismiss() {
    this._modalCtrl.dismiss();
  }
}
