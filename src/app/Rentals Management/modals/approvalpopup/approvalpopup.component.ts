import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { TranslateService } from '@ngx-translate/core';

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
    this.title=`Are you sure you want to ${this.val} this user's approval request?`
    // this.trans.get(`Are you sure you want to {{val}} this user's approval request?`, { val: this.val }).subscribe((res: string) => {
    //   this.title = res
    // })
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
