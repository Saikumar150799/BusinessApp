import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { ApprovalpopupComponent } from '../../modals/approvalpopup/approvalpopup.component';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { BuildingUserService } from '../../services/building-user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.page.html',
  styleUrls: ['./user-approval.page.scss'],
})
export class UserApprovalPage implements OnInit {

  approvals: any[];

  constructor(
    private loadingCtrl: LoadingController,
    private userService: BuildingUserService,
    private modalController: ModalController,
    private alertService: AlertServiceService,
    private popOver: PopoverController,
    public transService: translateService,
    private router:Router
  ) {
    this.getUserApprovals();
  }

  ngOnInit() {

  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    });
    await loading.present();
  }

  async getUserApprovals() {

    await this.presentLoading();

    this.userService.getUserApprovals()
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.approvals = data.data.data;
        console.log(data.data.data);
      },
        err => {
          this.loadingCtrl.dismiss();
          if (err.error.message == "You don't have permission for this operation!") {
            this.alertService.presentAlert('', "You don't have permission for this operation!")
            this.router.navigateByUrl('building-management-home')
          } else {
            this.alertService.presentAlert("", err.error.error);
          }
        }
      );
  }

  async approvalUser(id) {
    await this.presentLoading()
    this.userService.approve(id).subscribe(async data => {
      await this.loadingCtrl.dismiss()
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('user-approval.approval-success'))
      this.getUserApprovals();
      console.log('==================DATA==================');
      console.log(data);
      console.log('==================DATA==================');
    }, async err => {
      await this.loadingCtrl.dismiss()
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('something went wrong please try again'))
      console.log('==================ERROR==================');
      console.log(err);
      console.log('==================ERROR==================');
    })
  }
  async rejectUser(id, notes) {
    await this.presentLoading();
    this.userService.reject(id, notes).subscribe(async data => {
      await this.loadingCtrl.dismiss()
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('user-approval.reject-user'))
      this.getUserApprovals();
      console.log('==================DATA==================');
      console.log(data);
      console.log('==================DATA==================');
    }, async err => {
      await this.loadingCtrl.dismiss()
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('something went wrong please try again'))
      console.log('==================ERROR==================');
      console.log(err);
      console.log('==================ERROR==================');
    })

  }

  async presentPopover(val, id) {
    let popOver = await this.popOver.create({
      component: ApprovalpopupComponent,
      backdropDismiss: false,
      componentProps: {
        val: val
      }
    })
    popOver.onDidDismiss().then(data => {
      if (data.data) {
        if (data.data.val == 'approve') {
          this.approvalUser(id)
        } else if (data.data.val == 'reject') {
          this.rejectUser(id, data.data.notes)
        }
      }
    })
    return await popOver.present()
  }

  public call(number) {
    if (number) {
      window.location.href = 'tel:' + number;
    }
    else {
      this.alertService.presentAlert("",
        this.transService.getTranslatedData('Phone number not found'))
    }
  }
}