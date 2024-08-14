import { Component, OnInit, ViewChild } from "@angular/core";
import {
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  Events,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { GatePassService } from "../../services/gatepass/gate-pass.service";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { WorkPermitService } from "../../services/work-permit.service";
import { WorkPermitFilterComponent } from "../../modals/work-permit-filter/work-permit-filter.component";

@Component({
  selector: "app-work-permit",
  templateUrl: "./work-permit.page.html",
  styleUrls: ["./work-permit.page.scss"],
})
export class WorkPermitPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public loadingInstence: HTMLIonLoadingElement;
  public userId: string = "";
  public selectedTab: string = "myApprovals";
  public workPermits: any = [];
  public noWorkPermit: boolean = false;
  public workPermitFilter: any = {
    approvalStatus: ["open","in-progress","approved","rejected"],
    workStatus: ["completed","not-started","on-going","on-hold"],
    searchText: "",
    tenants: [],
    listings: [],
    workStartDate: "",
    workEndDate: "",
    createdDate: "",
    page: 1,
    limit: 10,
    user: "",
  };
  public workStatusOptions = {
    "not-started": "Not Started",
    "on-going": "In Progress",
    "on-hold": "On Hold",
    "completed": "Completed",
  };

  constructor(
    public transService: translateService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    // public workPermitFilterComponent: WorkPermitFilterComponent,
    public workPermitService: WorkPermitService,
    public alertService: AlertServiceService,
    public router: Router,
    public events: Events,
    public route: ActivatedRoute
  ) {
    this.selectedTab = "myApprovals";
    this.route.queryParams.subscribe((params) => {
      this.workPermitFilter.page = 1;
      this.workPermits = [];
      this.fetchworkPermits("");
    });
  }

  async ngOnInit() {}

  async tabChanged(event) {
    this.noWorkPermit = false;
    if (this.selectedTab === "myApprovals") {
      this.workPermits = [];
      this.workPermitFilter.page = 1;
      this.workPermitFilter.user = `&user=${this.userId}`;
      this.fetchworkPermits("");
    } else {
      this.workPermits = [];
      this.workPermitFilter.page = 1;
      this.workPermitFilter.user = "";
      this.fetchworkPermits("");
    }
  }

  routeToWorkPermitDetails(workPermit) {
    this.router.navigate(["/rentals-work-permit-details"], {
      queryParams: { workPermitId: workPermit._id },
    });
  }

  async presentLoading() {
    this.loadingInstence = await this.loadingCtrl.create({
      spinner: "lines",
    });
    await this.loadingInstence.present();
  }

  searchWorkPermit(event) {
    this.workPermitFilter.page = 1;
    this.infiniteScroll.disabled = true;
    this.workPermits = [];
    this.fetchworkPermits(event);
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: WorkPermitFilterComponent,
      componentProps: {
        data: JSON.parse(JSON.stringify(this.workPermitFilter)),
      },
    });
    modal.onDidDismiss().then((workPermitFilter: any) => {
      if (workPermitFilter != null && workPermitFilter.data) {
        this.workPermitFilter.workStartDate = workPermitFilter.data.workStartDate || "";
        this.workPermitFilter.workEndDate = workPermitFilter.data.workEndDate || "";
        this.workPermitFilter.createdDate =
          workPermitFilter.data.createdDate || "";

        this.workPermitFilter = Object.assign(
          this.workPermitFilter,
          workPermitFilter.data
        );
        this.workPermitFilter.page = 1;
        this.infiniteScroll.disabled = true;

        this.workPermits = [];
        this.fetchworkPermits("");
      }
    });

    return modal.present();
  }

  async fetchworkPermits(event) {
    await this.alertService.getDataFromLoaclStorage("user_id").then((val) => {
      this.userId = val;
    });
    if (this.selectedTab === "myApprovals") {
      this.workPermitFilter.user = `&user=${this.userId}`;
    }
    if (!event) {
      this.presentLoading();
    }
    console.log("filter", this.workPermitFilter);
    await this.workPermitService
      .getWorkPermits(this.workPermitFilter)
      .subscribe(
        (data: any) => {
          this.workPermits = this.workPermits.concat(data.rows);
          this.noWorkPermit = data.rows.length === 0 ? true : false;

          event && event.target
            ? event.target.complete()
            : this.loadingInstence.dismiss();
          this.workPermitFilter.page += 1;
          if (
            this.workPermitFilter.page >
            Math.ceil(data.count / this.workPermitFilter.limit)
          ) {
            this.infiniteScroll.disabled = true;
          } else {
            this.infiniteScroll.disabled = false;
          }
        },
        (err) => {
          console.log(err);
          this.loadingCtrl.dismiss();
          this.loadingInstence.dismiss();
          this.alertService.presentAlert("", err.error.message);
        }
      );
  }
}
