import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { OrgModalComponent } from '../org-modal/org-modal.component';
import { SearchProjectService } from 'src/app/common-services/search-properties/search-project.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private alertService: AlertServiceService,
    private userApprovalService: SearchProjectService,
    private navController: NavController,
    private translateService: translateService
  ) { }

  public org: any = {};
  public project: any = {};
  public type: any = {};
  public door: any = {};
  public nextForm: boolean = false;
  public adduser: any = {
    approval: {
      approvalData: {}
    },
    target: {

    }

  }


  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss()
  }


  presentOrgModal(type, id) {

    this.modalCtrl.create({
      component: OrgModalComponent,
      componentProps: {
        modalType: type,
        id: id ? id : undefined
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(res => {
        if (res != null) {
          if (res.role == 'org') {
            console.log(res);
            this.org = res.data.organization;
            this.adduser.approval.approvalData.org = res.data.organization._id
            window.localStorage.setItem('org', res.data.moduleName)
          } else if (res.role == 'project') {
            this.project = res.data;
            this.adduser.approval.approvalData.project = res.data._id
            console.log('====================================');
            console.log(this.project);
            console.log('====================================');
          } else if (res.role == 'door') {
            this.door = res.data
            console.log('====================================');
            console.log(res.data.homes[0]);
            console.log('====================================');
            // this.adduser.approval.approvalData.home = res.data._id
          }
        }

      })
    })
  }

  async orgSearch(type, id) {

    if (type == 'project' && !this.org._id) {
      this.alertService.presentAlert("", this.translateService.getTranslatedData('Please select an Organization'))
    } else if (type == 'door') {
      if (!this.org._id) {
        this.alertService.presentAlert("", this.translateService.getTranslatedData('Please select an Organization'))
      } else if (!this.project._id) {
        this.alertService.presentAlert("", this.translateService.getTranslatedData('Please select a Project'))
      } else {
        this.presentOrgModal(type, id)
      }
    } else {
      this.presentOrgModal(type, id)
    }
  }

  proceed() {
    this.nextForm = !this.nextForm
  }

  public async requestUserApproval() {
    if (this.adduser.approval.type) {
      if (this.adduser.approval.type == 'owner-approval') {
        this.adduser.approval.approvalData.listing = this.door._id
      } else if (this.adduser.approval.type == 'tenant-approval') {
        this.adduser.approval.approvalData.home = this.door.homes[0]
      }
    }

    var phoneno = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

    if (this.adduser.target.countryCode === "+965") {

      if (String(this.adduser.target.phoneNumber).match(phoneno)) {

        if (this.adduser.target.email) {
          if (this.validateEmail(this.adduser.target.email)) {
            this.createUserApproval();
          } else {
            this.alertService.presentAlert("", this.translateService.getTranslatedData("Please enter a valid email address."));
          }
        } else {
          this.createUserApproval();
        }

      } else {
        this.alertService.presentAlert("", this.translateService.getTranslatedData("Please enter a valid phone number"));
      }
    } else {
      if (String(this.adduser.target.phoneNumber).length > 4) {

        if (this.adduser.target.email) {
          if (this.validateEmail(this.adduser.target.email)) {
            this.createUserApproval();
          } else {
            this.alertService.presentAlert("", this.translateService.getTranslatedData("Please enter a valid email address."));
          }
        } else {
          this.createUserApproval();
        }

      } else {
        this.alertService.presentAlert("", this.translateService.getTranslatedData("Please enter a valid phone number"));
      }
    }

  }

  validateEmail(email) {
    var emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  }

  createUserApproval() {
    // this.presentLaoding();
    this.userApprovalService.createUserApproval(this.adduser).subscribe(
      async (data) => {
        // await this.loadingCtrl.dismiss();
        this.alertService.presentAlert('', this.translateService.getTranslatedData('User approval request received'))
        this.modalCtrl.dismiss()
        // this.navController.navigateRoot('/login');
      }, async err => {
        // this.mixpanel.track('building-management createUserApproval service Error', {
        //   error: err,
        //   data: this.adduser
        // });
        // await this.loadingCtrl.dismiss();
        console.log(err);
        this.alertService.presentAlert("", this.translateService.getTranslatedData('something went wrong please try again'))
      });
  }

}
