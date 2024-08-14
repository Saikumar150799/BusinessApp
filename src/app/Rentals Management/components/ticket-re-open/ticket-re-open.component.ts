import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { TicketService } from "../../services/ticket.service";
import * as moment from "moment";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ticket-re-open",
  templateUrl: "./ticket-re-open.component.html",
  styleUrls: ["./ticket-re-open.component.scss"],
})
export class TicketReOpenComponent implements OnInit {

  @Input() ticketId: string;

  public updateTicketStatusPayload: any = {};
  public commentData: any = {
    type: 'ticket',
    ticketCommentType: 'internal',
    text: ''
  };
  constructor(
    public translateService: translateService,
    public modalCtrl: ModalController,
    public ticketService: TicketService,
    public loadingCtrl: LoadingController,
    public changeDetecter: ChangeDetectorRef,
    public alertService: AlertServiceService,
    public route: ActivatedRoute
  ) {}

  public reOpenOptions = {
    OPTION_1: "Partial Resolution (Problem is not completely solved)",
    OPTION_2:
      "Unsatisfactory resolution (Problem is resolved but not upto the mark)",
    OPTION_3: "Accidentally marked as Resolved",
    OPTION_4: "Additional work is needed",
    OPTION_5: {
      text: "Other - Specify custom reason",
      customText: "",
    },
  };

  public selectedOption: string = this.reOpenOptions.OPTION_1;

  ngOnInit() {}

  async presentLoading() {
    const loader = await this.loadingCtrl.create({
      spinner: "lines",
    });
    return loader.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  updateTicketStatus() {

    this.updateTicketStatusPayload.status = "re-open";
    this.updateTicketStatusPayload.ticketId = this.ticketId;

    if (this.selectedOption == this.reOpenOptions.OPTION_5.text) {
      this.updateTicketStatusPayload.reason = this.reOpenOptions.OPTION_5.customText;
    } else {
      this.updateTicketStatusPayload.reason = this.selectedOption;
    }

    this.presentLoading();

    this.ticketService.updateTicketStatus(this.updateTicketStatusPayload).subscribe(
      (ticket) => {
        setTimeout(() => {
          this.loadingCtrl.dismiss();
          this.modalCtrl.dismiss('true');
        }, 200);
        this.createComment();
      },
      (err) => {
        setTimeout(() => {
          this.loadingCtrl.dismiss();
        }, 200);
        this.alertService.presentAlert("" , err.error.message || "Something went wrong please try again later");
      }
    );
  }

  public createComment() {
    this.commentData.ticket = this.ticketId;
    this.commentData.text = `This ticket is "Re-Opened" on ${moment().format('LL')} \n Reason: ${ this.updateTicketStatusPayload.reason}`

    this.ticketService.createComment(this.commentData).subscribe(data => {
    }, err => {
      this.alertService.presentAlert('', 'Something went wrong please try again later')
    });
  }

  
}
