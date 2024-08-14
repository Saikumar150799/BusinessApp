import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ProjectService } from '../../services/project.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-ticket-filte-project-search',
  templateUrl: './ticket-filte-project-search.component.html',
  styleUrls: ['./ticket-filte-project-search.component.scss'],
})
export class TicketFilteProjectSearchComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  projects: any[] = [];
  loading = false;
  selectedProject: any = {};
  public noProjects: boolean = false;

  filterData = {
    page: 1,
    searchText: '',
    limit: 15
  };

  constructor(
    private loadingCtrl: LoadingController,
    private projectService: ProjectService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    if (this.navParams.get('id')) {
      this.selectedProject.ticketBelongsToRefId = this.navParams.get('id');
      this.selectedProject.ticketBelongsToName = this.navParams.get('name');
    }
    this.searchProject('');
  }

  ngOnInit() {
  }

  async closeModal(sendData) {
    if (sendData) {
      console.log('Send data');
      await this.modalController.dismiss(this.selectedProject);
    } else {
      console.log('Dont Send data');
      await this.modalController.dismiss();
    }
  }

  selectProject(project) {
    this.selectedProject.ticketBelongsToName = project.name;
    this.selectedProject.ticketBelongsToRefId = project._id;
    this.closeModal(true);
  }

  // async presentLoading() {
  //   this.loading = await this.loadingCtrl.create({
  //   });
  //   this.loading.present();
  // }

  // type, searchtext, skip, token, status

  async searchProject(event) {

    if (!event) {
      this.loading = true;
    }

    this.projectService.getProjects(this.filterData)
      .subscribe((data: any) => {
        this.projects = this.projects.concat(data.rows);
        this.filterData.page += 1;
        event ? event.target.complete() : this.loading = false;

        this.noProjects = data.rows.length === 0 ? true : false;

       if( this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
        this.infiniteScroll.disabled = true;
       }else {
        this.infiniteScroll.disabled = false;
       }

      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.error);
        }
      );
  }

  resetFilterAndSearch() {
    this.projects = [];
    this.filterData.page = 1;
    this.searchProject('');
  }

}
