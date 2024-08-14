import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-checklist-drop-down',
  templateUrl: './checklist-drop-down.component.html',
  styleUrls: ['./checklist-drop-down.component.scss'],
})
export class ChecklistDropDownComponent implements OnInit {
  @Input() options: Array<any>;

  constructor(
    public transService: translateService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {  }


  public selectOption(selectedOption, options) {
    options.forEach(option => {
      option.selected = option._id === selectedOption._id;
    });
    this.popoverCtrl.dismiss(options, 'selected')
  }

}
