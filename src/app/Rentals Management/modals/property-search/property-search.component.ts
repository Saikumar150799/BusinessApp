import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalController, NavParams, IonInfiniteScroll } from "@ionic/angular";
import { FacilityBookingService } from "../../services/facility-booking.service";

@Component({
  selector: "app-property-search",
  templateUrl: "./property-search.component.html",
  styleUrls: ["./property-search.component.scss"],
})
export class PropertySearchComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  showText: any[];
  projects: any[];
  loading = false;
  selectedFacilityProject: any = [];
  selectedBookingProject: any = [];
  propertyCheck: any;

  filterData: any = {
    page: 1,
    limit: 15,
    searchTextProperty: "",
  };
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private facilityBookingService: FacilityBookingService
  ) {
    if (this.navParams.get("facilityPropertyData")) {
      this.selectedFacilityProject = this.navParams.get("facilityPropertyData");
    }
    if (this.navParams.get("bookingPropertyData")) {
      this.selectedBookingProject = this.navParams.get("bookingPropertyData");
    }
    if (this.navParams.get("propertyCheck")) {
      this.propertyCheck = this.navParams.get("propertyCheck");
    }
  }
  private loadingInstance: HTMLIonLoadingElement;

  ngOnInit() {
    this.viewProperties("");
  }

  viewProperties(event) {
    if (!event) {
      this.loading = true;
    }
    this.filterData.page = 1;
    this.facilityBookingService.getProperties(this.filterData).subscribe(
      (data: any[]) => {
        this.projects = data["rows"];
        try {
          event ? event.target.complete() : (this.loading = false);
        } catch (error) {

        }

        console.log(this.projects, "get property array");
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  selectProject(value) {
    if (this.propertyCheck === "facilities") {
      this.selectedFacilityProject.indexOf(value) === -1
        ? this.selectedFacilityProject.push(value)
        : this.selectedFacilityProject.splice(
          this.selectedFacilityProject.indexOf(value),
          1
        );
      console.log(
        this.selectedFacilityProject,
        "SELECTED FACILITY PROJECT ARRAY"
      );
    } else {
      this.selectedBookingProject.indexOf(value) === -1
        ? this.selectedBookingProject.push(value)
        : this.selectedBookingProject.splice(
          this.selectedBookingProject.indexOf(value),
          1
        );
      console.log(
        this.selectedBookingProject,
        "SELECTED BOOKING PROJECT ARRAY"
      );
    }
  }

  checkForSingleProject(project) {
    if (this.propertyCheck === "facilities") {
      return this.selectedFacilityProject.indexOf(project._id) != -1
        ? true
        : false;
    } else {
      return this.selectedBookingProject.indexOf(project._id) != -1
        ? true
        : false;
    }
  }

  closeModal(sendData) {
    if (this.propertyCheck === "facilities") {
      if (sendData) {
        console.log("Send data");
        this.modalController.dismiss(this.selectedFacilityProject);
      } else {
        console.log("Dont Send data");
        this.modalController.dismiss();
      }
    } else {
      if (sendData) {
        console.log("Send data");
        this.modalController.dismiss(this.selectedBookingProject);
      } else {
        console.log("Dont Send data");
        this.modalController.dismiss();
      }
    }
  }

  loadMoreProjects(event) {
    if (this.filterData.page === 1) this.filterData.page += 1;

    this.facilityBookingService.getProperties(this.filterData).subscribe(
      (data: any[]) => {
        this.projects = this.projects.concat(data["rows"]);
        this.filterData.page += 1;

        event ? event.target.complete() : this.loadingInstance.dismiss();

        if (
          this.filterData.page >
          Math.ceil(data["count"] / this.filterData.limit)
        ) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      },
      (err) => {
        console.log(err);
        this.loadingInstance.dismiss();
      }
    );
  }
}
