import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-success-alert-modal',
  templateUrl: './success-alert-modal.component.html',
  styleUrls: ['./success-alert-modal.component.scss'],
})
export class SuccessAlertModalComponent implements OnInit {
  @Input()data;

  constructor(
    public translateService: translateService,
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  dismissModal(){
    this.modalController.dismiss(true);
  }
}
