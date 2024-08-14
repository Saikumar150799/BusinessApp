import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { TicketService } from '../../services/ticket.service';
import { UserSearchPage } from '../../pages/user-search/user-search.page';
import { MaterialSearchPage } from '../../pages/material-search/material-search.page';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { TranslateService } from '@ngx-translate/core';
import { PictureComponent } from 'src/app/common-components/picture/picture.component';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {

  selectedTab;
  ticketId: string;
  ticket: any = {};
  ticketToBeUpdated: any;
  comments = [];
  activeMaterialSection = 'description';
  materialData: any = {};
  images: any[] = [];
  flag = 'false';

  async presentLoading() {
    await this.loadingCtrl.create({
    }).then(loading => {
      loading.present();
    })
  }

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private ticketService: TicketService,
    private modalController: ModalController,
    private alertService: AlertServiceService,
    private alertCtrl: AlertController,
    public transService: translateService,
    public trans: TranslateService,
    private actionSheet: ActionSheetController
  ) {

    console.log("constructor");


    this.route.queryParamMap.subscribe((params: any) => {
      params.params.ticketId ? this.ticketId = params.params.ticketId : '';
      params.params.flag ? this.flag = params.params.flag : '';
      params.params.tid ? this.ticketId = params.params.tid : '';
      console.log(this.ticketId, this.flag)
      this.getTicketDetails();
    });
  }

  ngOnInit() {
    this.selectedTab = 'SUMMARY';
    console.log(this.images.length);
  }

  ionViewWillEnter() {


    // if (this.flag === 'true') {
    //   console.log('true', this.ticketId);
    //   this.flag = 'false';
    //   this.ticket = [];
    //   this.getTicketDetails();
    // }
  }

  showMaterialForm() {
    this.activeMaterialSection = 'materialForm';
  }

  hideMaterialForm() {
    this.activeMaterialSection = 'description';
  }

  async getTicketDetails() {
    await this.presentLoading();
    this.ticketService.getTicketById(this.ticketId)
      .subscribe(async (data: any) => {
        this.ticket = data;
        await this.loadingCtrl.dismiss();
        // console.log(this.ticket);
      },
        async err => {
          this.alertService.presentAlert("",
            this.transService.getTranslatedData('something went wrong please try again'))
          await this.loadingCtrl.dismiss();
        }
      );
  }

  async getTicketComments() {
    await this.presentLoading();
    this.ticketService.getTicketComments(this.ticketId)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.comments = data.data;
        // console.log(this.comments);
      },
        err => {
          this.loadingCtrl.dismiss();
          this.alertService.presentAlert("",
            this.transService.getTranslatedData('something went wrong please try again'))
        }
      );
  }

  async updateTicket() {

    await this.presentLoading();
    if (this.ticketToBeUpdated.ticketCategory) {
      this.ticketToBeUpdated.ticketCategory = this.ticketToBeUpdated.ticketCategoryId;
    }

    if (this.ticketToBeUpdated.ticketSubCategory) {
      this.ticketToBeUpdated.ticketSubCategory = this.ticketToBeUpdated.ticketSubCategoryId;
    }
    if (this.images.length > 0) {
      console.log("With Image");
      console.log(this.ticketToBeUpdated);
      this.alertService.upload(this.images[0], this.ticketToBeUpdated, 'ADDTOTICKETDETAIL').then(async () => {
        await this.loadingCtrl.dismiss();
        console.log(this.images);
        this.images = []
        this.activeMaterialSection = 'description';
        this.materialData = {};
        this.getTicketDetails();
        this.alertService.presentAlert("",
          this.transService.getTranslatedData('ticket-details.ticket-updated'));
      }).catch(async error => {
        await this.loadingCtrl.dismiss()
        this.alertService.presentAlert("", "Something went wrong")
        console.log(error);
      });
    } else {
      console.log("Without Image");
      this.ticketService.updateTicket(this.ticketToBeUpdated)
        .subscribe(async () => {
          this.activeMaterialSection = 'description';
          this.materialData = {};
          await this.loadingCtrl.dismiss();
          this.getTicketDetails();
          this.alertService.presentAlert("",
            this.transService.getTranslatedData('ticket-details.ticket-updated'));
        },
          async err => {
            await this.loadingCtrl.dismiss();
            this.alertService.presentAlert("",
              this.transService.getTranslatedData('something went wrong please try again'))
          }
        );
    }

  }

  async openUserSearchModal(type) {

    this.ticketToBeUpdated = Object.assign({}, this.ticket);

    let id;

    if (type === 'agent' && this.ticketToBeUpdated.agent) {
      id = this.ticketToBeUpdated.agent._id;
    } else if (type === 'poc' && this.ticketToBeUpdated.contactPoint) {
      id = this.ticketToBeUpdated.contactPoint._id;
    }

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        id
      }
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        if (type === 'agent') {
          console.log('selecting technician');
          console.log(user);
          this.ticketToBeUpdated.agent = user.data.id;
          this.updateTicket();
        } else if (type === 'poc') {
          console.log('selecting point of contact');
          console.log(user);
          this.ticketToBeUpdated.contactPoint = user.data.id;
          this.updateTicket();
        }
      }
    });

    return await modal.present();
  }

  async createComment() {

    const data = {
      text: this.ticket.commentText,
      ticket: this.ticketId,
      type: 'ticket',
    };

    await this.presentLoading();
    this.ticketService.createComment(data)
      .subscribe((data: any) => {
        this.loadingCtrl.dismiss();
        this.getTicketComments();
        this.ticket.commentText = '';
        // this.router.navigateByUrl('/tickets');
      },
        err => {
          this.loadingCtrl.dismiss();
          this.alertService.presentAlert("",
            this.transService.getTranslatedData('something went wrong please try again'))
        }
      );
  }

  async updateCheckList(status, index) {

    this.ticketToBeUpdated = Object.assign({}, this.ticket);

    this.ticketToBeUpdated.checklist[index].completed = status;

    this.updateTicket();
    this.activeMaterialSection = 'description';
    this.materialData = {};
    // this.getTicketDetails();

  }

  async openMaterialSearchModal() {

    const modal = await this.modalController.create({
      component: MaterialSearchPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((materialData: any) => {
      console.log(materialData);

      this.materialData.name = materialData.data.name;
      this.materialData.product = materialData.data;

    });

    return await modal.present();
  }

  async tagMaterial() {
    this.ticketToBeUpdated = Object.assign({}, this.ticket);
    this.ticketToBeUpdated.itemDetails.push(this.materialData);
    this.updateTicket();
  }



  public presentActionSheet() {
    this.actionSheet.create({
      header: 'Select image from ',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
            this.fileSourceOption('camera');
          }
        },
        {
          text: 'Library',
          icon: 'images',
          handler: () => {
            this.fileSourceOption('library');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          handler: () => {
            console.log('cancel');
          }
        }
      ]
    }).then(actionsheet => {
      actionsheet.present()
    })
  }

  async fileSourceOption(type) {
    console.log(this.images);
    // if (this.images.length < 1) {
    let image = await this.alertService.capturePhoto(type);
    console.log("in add-visitor Page\n\n");
    console.log(image);

    if (image !== undefined) {
      this.images.push(image);
      this.images
      this.ticketToBeUpdated = Object.assign({}, this.ticket);
      this.updateTicket();
    }
    // } else {
    // this.alertService.presentAlert("Alert", "Only one picture is allowed!!")
    // }
  }

  async removeImage(id) {
    let alert = await this.alertCtrl.create({
      header: this.transService.getTranslatedData('ticket-details.remove-image'),
      buttons: [
        {
          text: this.transService.getTranslatedData('ticket-details.update.no'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.transService.getTranslatedData('ticket-details.update.yes'),
          handler: () => {
            console.log(id);
            this.ticketToBeUpdated = Object.assign({}, this.ticket);
            this.ticketToBeUpdated.files = this.ticketToBeUpdated.files.filter(value => value._id !== id);
            this.updateTicket();
          }
        }
      ]
    });
    return alert.present();
  }

  async removeMaterial(id) {
    let alert = await this.alertCtrl.create({
      header: this.transService.getTranslatedData('ticket-details.delete-material'),
      buttons: [
        {
          text: this.transService.getTranslatedData('ticket-details.update.no'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.transService.getTranslatedData('ticket-details.update.yes'),
          handler: () => {
            console.log(id);
            this.ticketToBeUpdated = Object.assign({}, this.ticket);
            this.ticketToBeUpdated.itemDetails = this.ticketToBeUpdated.itemDetails.filter(value => value._id !== id);
            this.updateTicket();
          }
        }
      ]
    });
    return alert.present();



  }

  public openImage(image: string) {
    this.modalController.create({
      component: PictureComponent,
      componentProps: { image: image }
    }).then(modal => {
      modal.present()
    })
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

  formData = {};

  async updatStatus(status: string) {
    let title: string = '';
    const ticketActionStatus = ['resolved']
    this.trans.get('ticket-details.update.title', { val: status == 'in-progress' ? 'IN PROGRESS' : status.toUpperCase() }).subscribe((res: string) => {
      title = res
    })
    this.ticketToBeUpdated = Object.assign({}, this.ticket);
    if (this.ticketToBeUpdated.status === 'open' && ticketActionStatus.includes(status)) {
      const alert = await this.alertCtrl.create({
        header: `Please change ticket status to in-progress first`,
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
          }
        ]
      });

      return alert.present();
    }
    else if (status !== this.ticketToBeUpdated.status) {
      if (this.ticketToBeUpdated.status === 'open'
        && !this.ticketToBeUpdated.agent
        && status !== 'rejected') {
        title = 'Technician/vendor is not tagged to this ticket. Do you still want to update the ticket status?'
      }
      const alert = await this.alertCtrl.create({
        header: title,
        buttons: [
          {
            text: this.transService.getTranslatedData('ticket-details.update.no'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.transService.getTranslatedData('ticket-details.update.yes'),
            handler: () => {
              this.ticketToBeUpdated.status = status;
              console.log(this.ticketToBeUpdated);
              this.updateTicket();


            }
          }
        ]
      });
      return alert.present();
    } else {
      this.alertService.presentAlert("",
        `${this.transService.getTranslatedData('ticket-details.update.status')} ${status}`);
    }
  }



}
