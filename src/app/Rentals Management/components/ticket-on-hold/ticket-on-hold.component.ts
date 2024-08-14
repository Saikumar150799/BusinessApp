import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as moment from 'moment';
import { TicketService } from '../../services/ticket.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { StorageService } from 'src/app/common-services/storage-service.service';
@Component({
  selector: 'app-ticket-on-hold',
  templateUrl: './ticket-on-hold.component.html',
  styleUrls: ['./ticket-on-hold.component.scss'],
})
export class TicketOnHoldComponent implements OnInit {
  @Input() ticket: any;
  public rejectionData: any = {};
  public reasonCount: number = 0;
  public updateTicketStatusPayload: any = {};
  constructor(
    public translateService: translateService,
    public modalCtrl: ModalController,
    public ticketService: TicketService,
    public alertService: AlertServiceService,
    public loadingCtrl: LoadingController,
    public storageService: StorageService
  ) { }

  ngOnInit() {
    console.log("ticket", this.ticket);
  }

  async presentLoading() {
    const loader = await this.loadingCtrl.create({
      spinner: "lines",
    });
    return loader.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  handleChange() {
    this.reasonCount = this.rejectionData.reason.trim().length;
  }

  ticketOnHold() {

    this.updateTicketStatusPayload.status = "on-hold";

    this.updateTicketStatusPayload.ticketId = this.ticket._id;

    this.updateTicketStatusPayload.reason = this.rejectionData.reason;

    this.presentLoading();

    this.ticketService.updateTicketStatus(this.updateTicketStatusPayload).subscribe((ticket) => {
      setTimeout(() => {
        this.loadingCtrl.dismiss();
        this.modalCtrl.dismiss("true");
      }, 200);
      this.createInternalComment();

      if (this.rejectionData.externalComments) {
        this.createExternalComment();
      }
    },
    (err) => {
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 200);
    }
  );
    
  }

  public createInternalComment() {
    const data: any = {
      type: 'ticket',
      ticketCommentType: 'internal',
      text: `This ticket is "Re-Opened" on ${moment().format('LL')} \n Reason: ${ this.rejectionData.reason}`,
      ticket: this.ticket._id
    };

    this.ticketService.createComment(data).subscribe(data => {
    }, err => {
      this.alertService.presentAlert('', 'Something went wrong please try again later')
    });
  }

  public createExternalComment() {
    const data: any = {
      type: 'ticket',
      ticketCommentType: 'external',
      text: `This ticket is "Re-Opened" on ${moment().format('LL')} \n Reason: ${ this.rejectionData.reason}`,
      ticket: this.ticket._id
    };

    this.ticketService.createComment(data).subscribe(data => {
    }, err => {
      this.alertService.presentAlert('', 'Something went wrong please try again later')
    });
  }
}
