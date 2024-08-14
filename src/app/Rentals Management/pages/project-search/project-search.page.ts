import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ProjectService } from '../../services/project.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.page.html',
  styleUrls: ['./project-search.page.scss'],
})
export class ProjectSearchPage implements OnInit {

  projects: any[] = [];
  loading = false;
  public checked = false;
  disableInfiniteScroll = false;
  public project: any = {
    projectList: []
  };
  @Input() selectedProjects: Array<any>;
  filterData = {
    page: 1,
    searchText: '',
    limit : 10
  };
  allSelected;

  constructor(
    private loadingCtrl: LoadingController,
    private projectService: ProjectService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService
  ) {
    if (this.navParams.get('id')) {
    }
    this.searchProject('');
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async searchProject(event) {

    if (!event) {
      this.loading = true;
    }

    this.projectService.getProjects(this.filterData)
      .subscribe((data: any) => {

        this.projects = this.projects.concat(data.rows);
        this.filterData.page += 1;

        event ? event.target.complete() : this.loading = false;

        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.disableInfiniteScroll = true;
        }
        this.checkForAllButton();
      },
        err => {
          this.loading = false;
          this.alertService.presentAlert('',
            err.error.message);
        }
      );
  }

  resetFilterAndSearch() {
    this.projects = [];
    this.filterData.page = 1;
    this.disableInfiniteScroll = false;
    this.searchProject('');
  }

  closeProjectModal() {
    this.project = {
      projectList: []
    };
    this.project.projectList = this.selectedProjects;
    this.modalController.dismiss(this.project, 'true');
  }

  selectAllProject() {
    if (this.selectedProjects.length === this.projects.length) {
      this.selectedProjects = [];
      this.checked = false;
    } else {
      this.selectedProjects = [];
      this.projects.forEach(ele => {
        this.selectedProjects.push(ele._id);
      });
      this.checked = true;
    }
  }

  checkForSingleProject(project) {
    return this.selectedProjects.indexOf(project._id) >= 0 ? true : false;
  }

  selectSingleProject(project) {
    if (this.selectedProjects.indexOf(project._id) < 0) {
      this.selectedProjects.push(project._id);
    } else {
      this.selectedProjects.splice(this.selectedProjects.indexOf(project._id), 1);
    }
    this.checkForAllButton();
  }
  checkForAllButton() {
    this.checked = this.selectedProjects.length === this.projects.length ? true : false;
  }

}
