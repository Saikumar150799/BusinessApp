import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { StorageService } from "src/app/common-services/storage-service.service";
import { translateService } from "src/app/common-services/translate/translate-service.service";

@Component({
  selector: "app-ticket-sort",
  templateUrl: "./ticket-sort.component.html",
  styleUrls: ["./ticket-sort.component.scss"],
})
export class TicketSortComponent implements OnInit {

  @Input() ticketSort: any;

  constructor(
    public storageService: StorageService,
    public popover: PopoverController,
    public translateService: translateService
  ) {}

  async ngOnInit() {
  }

  async selectSortValue(value) {
    this.popover.dismiss(true, value);
  }
}
