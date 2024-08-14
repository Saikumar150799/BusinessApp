import { Component, Input, OnInit } from '@angular/core';
import { Events, ModalController, NavParams } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { UnitSearchComponent } from '../../components/unit-search/unit-search.component';

@Component({
  selector: "app-gatepass-filter",
  templateUrl: "./gatepass-filter.component.html",
  styleUrls: ["./gatepass-filter.component.scss"],
})
export class GatepassFilterComponent implements OnInit {
  @Input() data;
  public gatepassFilter: any = {
    status: ["open", "in-progress", "approved", "rejected"],
    gatepassBelongsTo: ["returnable", "non-returnable"],
    listings: [],
  };
  public listingsSelectedText: string = "";
  constructor(
    public modalCtrl: ModalController,
    public transService: translateService,
    public navParams: NavParams,
    public events: Events,
  ) {}

  ngOnInit() {

    this.gatepassFilter = Object.assign(this.gatepassFilter,this.data);

    if ( this.gatepassFilter.listings.length === 1) {
      this.listingsSelectedText = "1 unit slected";
    } else if ( this.gatepassFilter.listings.length > 1) {
      this.listingsSelectedText = `${ this.gatepassFilter.listings.length} units selected`;
    } else {
      this.listingsSelectedText = "";
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selectGatePassStatus(value) {
    this.gatepassFilter.status.indexOf(value) == -1
      ? this.gatepassFilter.status.push(value)
      : this.gatepassFilter.status.splice(
          this.gatepassFilter.status.indexOf(value),
          1
        );
    console.log(this.gatepassFilter.status);
  }

  selectgatepassBelongsTo(value) {
    this.gatepassFilter.gatepassBelongsTo.indexOf(value) == -1
      ? this.gatepassFilter.gatepassBelongsTo.push(value)
      : this.gatepassFilter.gatepassBelongsTo.splice(
          this.gatepassFilter.gatepassBelongsTo.indexOf(value),
          1
        );
    console.log(this.gatepassFilter.gatepassBelongsTo);
  }


  async openUnitSearchModal() {
    await this.modalCtrl
      .create({
        component: UnitSearchComponent,
        componentProps: {
          filterdListings: JSON.parse(
            JSON.stringify(this.gatepassFilter.listings)
          ),
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then((unitFilter: any) => {

          if (unitFilter !== undefined && unitFilter.data) {

            this.gatepassFilter.listings = unitFilter.data;
            if (unitFilter.data.length === 1) {
              this.listingsSelectedText = "1 unit slected";
            } else if (unitFilter.data.length > 1) {
              this.listingsSelectedText = `${unitFilter.data.length} units selected`;
            } else {
              this.listingsSelectedText = "";
            }
          }
        });
        return modal.present();
      });
  }

  reset() {
    this.gatepassFilter = {
      status: ["open", "in-progress", "approved", "rejected"],
      gatepassBelongsTo: ["returnable", "non-returnable"],
      listings: [],
    };
    this.listingsSelectedText = "";

    if (this.gatepassFilter.inwardDate) {
      this.gatepassFilter.inwardDate = "" ;
    }
    if (this.gatepassFilter.createdDate) {
      this.gatepassFilter.createdDate = "" ;
    }
    if (this.gatepassFilter.outwardDate) {
      this.gatepassFilter.outwardDate = "" ;
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async apply(){
    await this.modalCtrl.dismiss(this.gatepassFilter);
  }
} 
