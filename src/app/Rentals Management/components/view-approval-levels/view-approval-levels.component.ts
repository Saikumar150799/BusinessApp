import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-view-approval-levels',
  templateUrl: './view-approval-levels.component.html',
  styleUrls: ['./view-approval-levels.component.scss'],
})
export class ViewApprovalLevelsComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;

  constructor(
    public transService: translateService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
