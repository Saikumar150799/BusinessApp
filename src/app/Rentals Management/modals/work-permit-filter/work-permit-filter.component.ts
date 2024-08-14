import { Component, Input, OnInit } from "@angular/core";
import { Events, ModalController, NavParams } from "@ionic/angular";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { UnitSearchComponent } from "../../components/unit-search/unit-search.component";
import { UserSearchPage } from "../../pages/user-search/user-search.page";
import * as _ from "lodash";

@Component({
  selector: "app-work-permit-filter",
  templateUrl: "./work-permit-filter.component.html",
  styleUrls: ["./work-permit-filter.component.scss"],
})
export class WorkPermitFilterComponent implements OnInit {
  @Input() data;
  listingsSelectedText: string = "";
  tenantSelectedText: string = "";
  public workPermitFilter: any = {
    approvalStatus: ["open","in-progress","approved","rejected"],
    workStatus: ["completed","not-started","on-going","on-hold"],
    searchText: "",
    tenants: [],
    listings: [],
    workDateStart: '',
    workDateEnd: '',
    createdDate: ''
  };

  constructor(
    public modalCtrl: ModalController,
    public transService: translateService,
    public navParams: NavParams,
    public events: Events
  ) {}

  ngOnInit() {
    this.workPermitFilter = Object.assign(this.workPermitFilter, this.data);
    if (!_.isEmpty(this.data)) {
      if (!_.isEmpty(this.data.listings)) {
        if (this.workPermitFilter.listings.length === 1) {
          this.listingsSelectedText = "1 unit slected";
        } else if (this.workPermitFilter.listings.length > 1) {
          this.listingsSelectedText = `${this.workPermitFilter.listings.length} units selected`;
        }
      } else {
        this.listingsSelectedText = "";
      }

      if (!_.isEmpty(this.data.tenants)) {
        if (this.workPermitFilter.tenants.length === 1) {
          this.tenantSelectedText = "1 tenant slected";
        } else if (this.workPermitFilter.tenants.length > 1) {
          this.tenantSelectedText = `${this.workPermitFilter.tenants.length} tenants selected`;
        }
      } else {
        this.tenantSelectedText = "";
      }
    }  
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selectWorkPermitStatus(type: string, value) {
    this.workPermitFilter[type].indexOf(value) == -1
      ? this.workPermitFilter[type].push(value)
      : this.workPermitFilter[type].splice(
          this.workPermitFilter[type].indexOf(value),
          1
        );
    console.log(this.workPermitFilter[type]);
  }

  async openUnitSearchModal() {
    await this.modalCtrl
      .create({
        component: UnitSearchComponent,
        componentProps: {
          filterdListings: JSON.parse(
            JSON.stringify(this.workPermitFilter.listings)
          ),
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then((unitFilter: any) => {
          if (unitFilter !== undefined && unitFilter.data) {
            console.log("unitFilterData-------", unitFilter.data);
            this.workPermitFilter.listings = unitFilter.data;
            if (unitFilter.data.length === 1) {
              this.listingsSelectedText = "1 unit selected";
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

  async openUserSearchModal(type) {
    let id;
    let name;
    let persons = [];

    if (type === 'tenants') {
      id = this.workPermitFilter.tenants;
      persons = this.workPermitFilter.tenants ? this.workPermitFilter.tenants : [];
    }
    const modal = await this.modalCtrl.create({
      component: UserSearchPage,
      componentProps: {
        id,
        type,
        persons
      },
    });

    modal.onDidDismiss().then((user) => {
      if (user !== null && user.data) {
        console.log("userData-----", user.data);
        this.workPermitFilter.tenants = user.data;
        if (user.data.length === 1) {
          this.tenantSelectedText = "1 tenant selected";
        } else if (user.data.length > 1) {
          this.tenantSelectedText = `${user.data.length} tenants selected`;
        } else {
          this.tenantSelectedText = "";
        }
      }
    });

    return await modal.present();
  }

  openModal(value) {
    if (value === "unit") {
      this.openUnitSearchModal();
    } else if (value === "tenants") {
      this.openUserSearchModal("tenants");
    }
  }

  reset() {
    this.workPermitFilter = {
      approvalStatus: ["open", "in-progress","approved","rejected"],
      workStatus: ["completed","not-started","on-going","on-hold"],
      searchText: "",
      tenants: [],
      listings: [],
      workStartDate: "",
      workEndDate: "",
      createdDate: "",
    };
    this.listingsSelectedText = "";
    this.tenantSelectedText = "";
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async apply() {
    await this.modalCtrl.dismiss(this.workPermitFilter);
  }
}
