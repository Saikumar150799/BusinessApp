import { Component, OnInit } from '@angular/core';
import { MyDataProjectService } from 'src/app/Building-Management/services/mydata-services/my-data-project.service';
import { PopoverController, LoadingController } from '@ionic/angular';
import { MyDataProjectFilterComponent } from '../../components/my-data-project-filter/my-data-project-filter.component';



@Component({
  selector: 'app-my-data-project',
  templateUrl: './my-data-project.page.html',
  styleUrls: ['./my-data-project.page.scss'],
})
export class MyDataProjectPage implements OnInit {

  public filterData: any = {
    status: 'completed',
    skip: 0,
    limit: 5,
    searchText: ''
  }

  public projectList: any = []

  public disableInfiniteScroll: boolean = false;

  constructor(
    private projectService: MyDataProjectService,
    private popOverCtrl: PopoverController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getProjects('')
  }

  async presentLoading(): Promise<void> {
    await this.loadingCtrl.create({
      spinner: 'lines'
    }).then(loading => {
      loading.present()
    })
  }
  async popOverOption(): Promise<void> {
    let popOver = await this.popOverCtrl.create({
      component: MyDataProjectFilterComponent,
      event: event,
      mode: 'ios',
      componentProps: {
        data: this.filterData
      }
    })
    popOver.onDidDismiss().then(data => {
      if (data.data) {
        this.filterData.status = data.data
        this.filterData.skip=0
        this.projectList=[]
        this.getProjects('')
      }

    })
    return await popOver.present()
  }



  getProjects(event): void {
    !event ? this.presentLoading() : ''
    this.projectService.getprojectList(this.filterData).subscribe(async data => {
      this.projectList = this.projectList.concat(data.data.searchResult);
      this.filterData.countInformation = data.data.countInformation
      this.filterData.skip = data.data.query.skip + 5;
      console.log("disableInfiniteScroll before event " + this.disableInfiniteScroll);

      event ? event.type == 'ionInfinite' ? event.target.complete() : this.disableInfiniteScroll = false : await this.loadingCtrl.dismiss();
      data.data.query.current >= data.data.query.total ? this.disableInfiniteScroll = true : this.disableInfiniteScroll = false;
      console.log("disableInfiniteScroll after event " + this.disableInfiniteScroll);

    });
  }

  resetFilterAndSearch(event) {
    if (event.type !== 'ionInfinite') {
      this.projectList = [];
      this.filterData.skip = 0;
      this.disableInfiniteScroll = true;
    }
    this.getProjects(event);
  }

}
