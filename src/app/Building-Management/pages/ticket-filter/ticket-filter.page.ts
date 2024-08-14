import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { ProjectSearchPage } from '../../pages/project-search/project-search.page';
import { UserSearchPage } from '../../pages/user-search/user-search.page';
import * as _ from 'lodash';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-filter',
  templateUrl: './ticket-filter.page.html',
  styleUrls: ['./ticket-filter.page.scss'],
})
export class TicketFilterPage implements OnInit {

  ticketFilter: any = {
    status: ['open', 'in-progress'],
    ticketBelongsTo: ['Home', 'Project'],
    type: ['on-demand'],
    priority: ['low', 'high']
  };

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public transService: translateService,
    private alertService: AlertServiceService,
    private barcodeScanner: BarcodeScanner,
    private ticketService: TicketService,
    private alertCtrl: AlertController,

  ) {
    if (this.navParams.get('data')) {
      this.ticketFilter = this.navParams.get('data');
      console.log(this.ticketFilter);
    }

  }

  ngOnInit() {
  }

  selectTicketStatus(value) {
    this.ticketFilter.status.indexOf(value) === -1 ? this.ticketFilter.status.push(value) : this.ticketFilter.status.splice(this.ticketFilter.status.indexOf(value), 1);
    // this.ticketFilter.status = _.union([value], this.ticketFilter.status);
    console.log(this.ticketFilter.status);
  }

  selectTicketBelongsTo(value) {
    this.ticketFilter.ticketBelongsTo.indexOf(value) === -1 ? this.ticketFilter.ticketBelongsTo.push(value) : this.ticketFilter.ticketBelongsTo.splice(this.ticketFilter.ticketBelongsTo.indexOf(value), 1);
    console.log(this.ticketFilter.ticketBelongsTo);
  }

  selectTicketType(value) {
    this.ticketFilter.type.indexOf(value) === -1 ? this.ticketFilter.type.push(value) : this.ticketFilter.type.splice(this.ticketFilter.type.indexOf(value), 1);
    console.log(this.ticketFilter.type);
  }

  selectTicketPriority(value) {
    this.ticketFilter.priority.indexOf(value) === -1 ? this.ticketFilter.priority.push(value) : this.ticketFilter.priority.splice(this.ticketFilter.priority.indexOf(value), 1);
    console.log(this.ticketFilter.priority);
  }

  async openProjectSearchModal() {

    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        id: this.ticketFilter.ticketBelongsToRefId,
        name: this.ticketFilter.ticketBelongsToName
      }
    });

    modal.onDidDismiss().then((project: any) => {
      if (project !== null && project.data) {
        this.ticketFilter.ticketBelongsToName = project.data.ticketBelongsToName;
        this.ticketFilter.ticketBelongsToRefId = project.data.ticketBelongsToRefId;
        console.log(this.ticketFilter);
      }
    });

    return await modal.present();
  }

  async openUserSearchModal(type) {

    let id;
    let name;

    if (type === 'agent') {
      id = this.ticketFilter.agent;
      name = this.ticketFilter.agentName;
    } else if (type === 'poc') {
      id = this.ticketFilter.contactPoint;
      name = this.ticketFilter.contactPointName;
    }

    const modal = await this.modalController.create({
      component: UserSearchPage,
      componentProps: {
        id,
        name
      }
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        if (type === 'agent') {
          this.ticketFilter.agentName = user.data.name;
          this.ticketFilter.agent = user.data.id;

        } else if (type === 'poc') {
          this.ticketFilter.contactPointName = user.data.name;
          this.ticketFilter.contactPoint = user.data.id;
        }
        console.log(this.ticketFilter);
      }
    });

    return await modal.present();
  }

  applyFilter() {
    console.log(this.ticketFilter);
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.ticketFilter);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  async openScanner() {
    // Scann QR Code.'
    this.barcodeScanner.scan().then(async (barcodeData) => {
      const { text } = barcodeData;
      if (!text) {
        this.alertService.presentAlert("", 'Invalid barcode');
      } else {
        this.ticketService.searchAssert(text)
          .subscribe(async (data: any) => {
            await this.alertCtrl.create({
              header: data.name,
              message: `
            <b>AssertId:-</b>${data.assetId || 'N/A'}<br/>

            <b>Category:-</b> ${data.category || 'N/A'}<br/>
            
            <b>Location:-</b> ${data.location || 'N/A'}<br/>
            
            <b>Floor:-</b> ${data.floor || 'N/A'}<br/>
            
            <b>Description:-</b> ${data.description || 'N/A'}`,
              buttons: [
                {
                  text: 'Scan Again',
                  role: 'cancel',
                  handler: () => {
                    this.openScanner()
                  }
                },
                {
                  text: 'Confirm',
                  role: 'ok',
                  handler: () => {
                    this.ticketFilter.asset = data._id;
                    this.ticketFilter.assetId = data.assetId
                  }
                }]
            }).then(alert => {
              alert.present()
            })
          },
            err => {
              this.alertService.presentAlert("", err.error.message);
            }
          );
      }
    })
  }

}
