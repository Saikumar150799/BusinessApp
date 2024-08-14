import { Component, OnInit, Input, } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { SearchProjectService } from 'src/app/common-services/search-properties/search-project.service';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
// import { AlertserviceService } from 'src/app/common-services/alert/alertservice.service';
// import { Mixpanel } from '@ionic-native/mixpanel/ngx';

@Component({
  selector: 'app-org-modal',
  templateUrl: './org-modal.component.html',
  styleUrls: ['./org-modal.component.scss'],
})

export class OrgModalComponent implements OnInit {

  public searchText = '';
  public isloggedin = 'false';
  public searchType = 'project';
  public resultCount;
  public title;
  public display;
  public doors = [];
  private loaginInstence: HTMLIonLoadingElement;
  public org: any = {
    type: "multi",
    bm: {
      organization: {
        _id: "5943d4efa3d24b443f4008a2",
        name: "Monk Realty Solutions Pvt Ltd",
        status: "active",
        logo: { "thumbnail": "https://thehousemonk-saas-ramaniyam.s3-ap-southeast-1.amazonaws.com/demoAccount/S3C/documents/bc9af9b4-905c-434a-8121-35201db9a0ab-VnV-TE4F_fiSyYRJSdDzPVyd_c.png" }
      },
      action: "register",
      moduleName: "BM"
    },
    // rm: {
    //   organization: {
    //     _id: "5943d4efa3d24b443f4008a2",
    //     name: "Monk Realty Solutions Pvt Ltd",
    //     status: "active",
    //     logo: { "thumbnail": "https://thehousemonk-saas-ramaniyam.s3-ap-southeast-1.amazonaws.com/demoAccount/S3C/documents/bc9af9b4-905c-434a-8121-35201db9a0ab-VnV-TE4F_fiSyYRJSdDzPVyd_c.png" }
    //   },
    //   action: "register",
    //   moduleName: "RM"
    // },
    rm: {
      types: ["tenant"],
      organization: {
        _id: "5d67abae2fca1d4059d940cb",
        name: "Grexter Living",
        status: "active",
        logo: { "thumbnail": "https://thehousemonk-saas-ramaniyam.s3-ap-southeast-1.amazonaws.com/GrexterLiving-5d67abae2fca1d4059d940cb/S3C/documents/a8485ad4-75b8-43b3-8b91-4690a97e6b11-prrmYkcRf9MhoxJKZ9z3y6kV_c.png" }
      },
      action: "login",
      moduleName: "RM"
    }
  }
  public projects: any = [];

  @Input() modalType: any;
  @Input() id: any
  constructor(
    private modalCtrl: ModalController,
    private searchProjectService: SearchProjectService,
    private alertService: AlertServiceService,
    private loading: LoadingController,
    public translateService: translateService
  ) {

  }

  ngOnInit() {
    if (this.modalType == 'org') {
      this.searchOrg()
      this.title = 'an organization';
    } else if (this.modalType == "project") {
      this.searchProject()
      this.title = 'a project';
    } else if (this.modalType == 'door') {
      this.title = 'a unit'
      this.searchDoor()
    }
  }
  async presentLoading() {
    this.loaginInstence = await this.loading.create({
      spinner: 'lines',
    });
    await this.loaginInstence.present();
  }

  close(data?: any) {
    if (data) {
      this.modalCtrl.dismiss(data, this.modalType)
    } else {
      this.modalCtrl.dismiss(null, null)
    }

  }

  searchOrg() {

  }

  async searchDoor() {
    await this.presentLoading()
    console.log('====================================');
    console.log(this.searchText);
    console.log('====================================');
    this.searchProjectService.searchProject('listings', this.searchText, 0, 'project', this.id).subscribe(
      async (data: any) => {
        await this.loaginInstence.dismiss();
        this.doors = data.listingsWithHomes
      }, async err => {
        await this.loaginInstence.dismiss();
        // this.mixpanel.track('error while calling searchproject service', {
        //   type: 'listings',
        //   org: 'project',
        //   id: this.id
        // })
        this.alertService.presentAlert("", this.translateService.getTranslatedData('something went wrong please try again'))
      })

  }

  async searchProject() {
    await this.presentLoading();
    console.log('====================================');
    console.log(this.id);
    console.log('====================================');
    let type = '';
    let skip = 0;
    let org;
    this.searchText;
    this.searchProjectService.searchProject('projects', this.searchText, skip, 'organization', this.id).subscribe(
      async (data: any) => {
        await this.loaginInstence.dismiss();
        this.projects = data.data;
      }, async err => {
        await this.loaginInstence.dismiss();
        this.alertService.presentAlert("", this.translateService.getTranslatedData('something went wrong please try again'))
        // this.mixpanel.track('Error in calling searchProject service', {
        //   type: 'projects',
        //   org: 'organization',
        //   id: this.id
        // })
      });
  }

}
