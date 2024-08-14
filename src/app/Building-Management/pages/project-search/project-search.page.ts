import { AlertServiceService } from '../../../common-services/alert-service.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ProjectService } from '../../services/project.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.page.html',
  styleUrls: ['./project-search.page.scss'],
})
export class ProjectSearchPage implements OnInit {

  projects: any[] = [];
  loading = false;
  disableInfiniteScroll = false;
  selectedProject: any = {};

  filterData = {
    skip: 0,
    searchText: ''
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

        this.projects = this.projects.concat(data.data.searchResult);
        this.filterData.skip = data.data.query.skip + 10;

        console.log(this.projects);

        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');

        if (data.data.query.current >= data.data.query.total) {
          this.disableInfiniteScroll = true;
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
    this.filterData.skip = 0;
    this.disableInfiniteScroll = false;
    this.searchProject('');
  }

}
