import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-approvalpopup',
  templateUrl: './approvalpopup.component.html',
  styleUrls: ['./approvalpopup.component.scss'],
})
export class ApprovalpopupComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    public transService: translateService,
    public trans: TranslateService
  ) { }
  @Input() val;
  public notes;
  public flag;
  public title
  ngOnInit() {
    this.trans.get('approval-popup-modal.title', { val: this.val }).subscribe((res: string) => {
      this.title = res
    })
  }
  cancel() {
    this.popoverCtrl.dismiss()
  }
  dismiss() {
    let data = {
      val: this.val,
      notes: this.notes || {}
    }
    this.popoverCtrl.dismiss(data)
  }

}
