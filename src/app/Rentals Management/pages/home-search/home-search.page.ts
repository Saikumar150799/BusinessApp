import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll, ModalController, NavParams } from "@ionic/angular";
import { UnitService } from "../../services/unit.service";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { translateService } from "src/app/common-services/translate/translate-service.service";

@Component({
  selector: "app-home-search",
  templateUrl: "./home-search.page.html",
  styleUrls: ["./home-search.page.scss"],
})
export class HomeSearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  homes: any[] = [];
  loading = false;
  selectedHome: any = {};
  searchTerm: any;
  filterData: any = {
    page: 1,
    searchText: "",
    limit: 15,
    types : ["commercial-subscription", "commercial-on-demand"],
    occupancyStatus: [
    "shifting",
    "not_ready",
    "move_in_pending",
    "under_notice",
    "occupied_by_tenant",
    "vacant",
    "occupied_by_owner",
]
  };
  @Input() projectId: string;

  constructor(
    private unitService: UnitService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {}

  ngOnInit() {
    this.filterData.projectId = this.projectId;
    if (this.navParams.get("id")) {
      this.selectedHome.ticketBelongsToRefId = this.navParams.get("id");
      this.selectedHome.ticketBelongsToName = this.navParams.get("name");
    }

    this.searchHome("");
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log("Send data");
      await this.modalController.dismiss(this.selectedHome);
    } else {
      console.log("Dont Send data");
      await this.modalController.dismiss();
    }
  }

  selectHome(home) {
    this.selectedHome.ticketBelongsToName = "";
    if (home.displayName) {
      this.selectedHome.ticketBelongsToName = home.displayName;
    }
    this.selectedHome.ticketBelongsToRefId = home._id;
    this.closeModal(true);
  }

  async searchHome(event) {
    if (!event) {
      this.loading = true;
    }

    this.unitService.getUnits(this.filterData).subscribe(
      (data: any) => {
        this.homes = this.homes.concat(data.rows);
        this.filterData.page += 1;

        console.log(this.homes);

        event ? event.target.complete() : (this.loading = false);
        console.log("loading should dismiss");

        if (
          this.filterData.page > Math.ceil(data.count / this.filterData.limit)
        ) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
      (err) => {
        this.loading = false;
        this.alertService.presentAlert("", err.error.message);
      }
    );
  }

  resetFilterAndSearch() {
    this.homes = [];
    this.filterData.page = 1;
    this.infiniteScroll.disabled = true;
    this.searchHome("");
  }
}
