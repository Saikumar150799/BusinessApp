import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-select-sign-option',
  templateUrl: './select-sign-option.component.html',
  styleUrls: ['./select-sign-option.component.scss'],
})
export class SelectSignOptionComponent implements OnInit {

  @Input() unitData: any;
  public tenantAppPermission: boolean = false;
  
  constructor(
    public translateService: translateService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.checkAppPermissions();
  }

  closeModal(option: string) {
    this.modalCtrl.dismiss(option);
  }

  checkAppPermissions(){
    this.tenantAppPermission =  this.unitData.appPermission && 
    this.unitData.appPermission.checkIn && 
    this.unitData.appPermission.checkIn.tenantApp === true &&
    this.unitData.isCheckInAllowed
  }

}
