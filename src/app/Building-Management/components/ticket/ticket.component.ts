import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {

  constructor(
    private popOverCtrl: PopoverController
  ) { }

  ngOnInit() { }
  close() {
    this.popOverCtrl.dismiss();
  }

}
