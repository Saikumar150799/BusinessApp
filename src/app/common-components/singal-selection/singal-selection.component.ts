import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  IonInfiniteScroll,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { AlertServiceService } from "src/app/common-services/alert-service.service";
import { translateService } from "src/app/common-services/translate/translate-service.service";
import { TicketService } from "src/app/Rentals Management/services/ticket.service";
import * as _ from "lodash";

@Component({
  selector: "app-singal-selection",
  templateUrl: "./singal-selection.component.html",
  styleUrls: ["./singal-selection.component.scss"],
})
export class SingalSelectionComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() headerTitle: string;
  @Input() type: string;
  @Input() selected;

  public searchData = [];
  public loading: boolean = false;
  public emptyString: string = "No Data Found";
  public filterData: { page: number; limit: number; searchText: string } = {
    page: 1,
    limit: 15,
    searchText: "",
  };

  constructor(
    public transService: translateService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public ticketService: TicketService,
    public alertService: AlertServiceService,
    public changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.infiniteScroll.disabled = true;
    this.getData();
  }

  public async showLoading() {
    const loader = await this.loadingCtrl.create({
      spinner: "lines",
    });
    return loader.present();
  }

  public hideLoading() {
    this.loadingCtrl.dismiss();
  }

  public async getData(event = "") {
    switch (this.type) {
      case "checklist":
        this.getChecklist(event);
        break;

      default:
        break;
    }
  }

  public getChecklist(event) {
    this.loading = true;
    this.ticketService.getChecklist(this.filterData).subscribe(
      (data) => {
        this.loading = false;
        this.searchData = this.searchData.concat(data.rows);

        if( event && event.target) {
          event.target.complete()
        }
        this.filterData.page += 1;
        if (
          this.filterData.page > Math.ceil(data.count / this.filterData.limit)
        ) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
        this.emptyString = "No checklist available";
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.alertService.presentAlert(
          "",
          err.error.message || "Something went wrong"
        );
      }
    );
  }

  sortList(selected, searchList) {

    const index = searchList.findIndex((data) => data._id === selected.checkListId);
  
    if (index !== -1) {
      const selectedData = searchList.splice(index, 1)[0] // remove the object from the array
      searchList.unshift(selectedData); // add the object to the beginning of the array
    }

    return searchList;
  }

  checked(data) {
    let id;
    
    if (this.selected.checkListId) {
      id = this.selected.checkListId;
    }
    return id === data._id;
  }

  resetFilterAndSearch() {
    this.filterData.page = 1;
    this.searchData = [];
    this.infiniteScroll.disabled = true;
    this.getData();
  }

  closeModal(data = {}) {
    return !_.isEmpty(data) ? this.modalCtrl.dismiss(data): this.modalCtrl.dismiss();
  }
}
