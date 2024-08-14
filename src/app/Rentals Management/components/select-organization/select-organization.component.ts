import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-select-organization',
  templateUrl: './select-organization.component.html',
  styleUrls: ['./select-organization.component.scss'],
})
export class SelectOrganizationComponent implements OnInit {
  @Input() data;

  constructor(
    public translateService: translateService,
    public popOver: PopoverController
  ) { }

  ngOnInit() {  }

  async close(data?: any) {
    if (data) {
      this.popOver.dismiss(data)

    } else {
      this.popOver.dismiss()
    }
  }

}
