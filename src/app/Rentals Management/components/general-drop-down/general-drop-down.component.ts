import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, LoadingController, ModalController } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";

@Component({
  selector: 'app-general-drop-down',
  templateUrl: './general-drop-down.component.html',
  styleUrls: ['./general-drop-down.component.scss'],
})
export class GeneralDropDownComponent implements OnInit {
  public loadingInstance: HTMLIonLoadingElement;
  @Input() items: Array<any>;

  constructor(public transService: translateService,
    private popoverCtrl: PopoverController,) { }

  ngOnInit() {
    
  }

  closeModal() {
    // Handle the cancel action
    console.log("Cancel action");
    this.popoverCtrl.dismiss();
  }

}
