import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { AlertServiceService } from 'src/app/common-services/alert-service.service';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import { RentalsUserService } from '../../services/rentals-user.service';
import { TicketService } from '../../services/ticket.service';


@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.page.html',
  styleUrls: ['./user-search.page.scss'],
})
export class UserSearchPage implements OnInit {

  @Input() ticketData: any;
  @Input() type: string
  @Input() persons: Array<any> = [];
  @Input() id: string;
  users: any[] = [];
  loading = false;
  selectedUsers: any[] = []
  selectedUser: any = {}
  disableInfiniteScroll = false;

  filterData = {
    page: 1,
    searchText: '',
    limit: 20
  };


  constructor(
    // private loading: LoadingController,
    private userService: RentalsUserService,
    private modalController: ModalController,
    private navParams: NavParams,
    private alertService: AlertServiceService,
    public transService: translateService,
    public ticketService: TicketService
  ) {
    if (this.navParams.get('id')) {
      // this.selectedUser._id = this.navParams.get('id');
      // this.selectedUsers.name = this.navParams.get('name');
    }
  }

  ngOnInit() {

    this.selectedUsers = this.persons.length > 0 ? this.persons : [];
    this.searchUsers('');
  }

  // async presentLoading() {
  //   const loading = await this.loading.create({
  //   });
  //   await loading.present();
  // }

  selectUser(user) {
    if(this.type ==='poc' || this.type === 'createdBy' || this.type === 'tenants'){
      if (this.selectedUsers.indexOf(user._id) < 0) {
        this.selectedUsers.push(user._id);
      } else {
        this.selectedUsers.splice(this.selectedUsers.indexOf(user._id), 1);
      }
    }else{
      this.selectedUsers = [];
      let singleUser: any = {}
      if (user.firstName) {
        singleUser.name = user.firstName;
      }
      if (user.lastName) {
        singleUser.name = singleUser.name + ' ' + user.lastName;
      }
      singleUser.firstName = user.firstName
      singleUser.lastName = user.lastName
      singleUser._id = user._id;
      this.selectedUsers.push(singleUser)
      this.closeModal(true);
    }

    console.log("this.selectedUsers",this.selectedUsers);
  }

  async searchUsers(event) {

    if (!event) {
      this.loading = true;
    }
    this.userService.getUsers(this.type, this.filterData)
      .subscribe(async (data: any) => {
        this.loading = false;
        this.users = this.users.concat(data.rows);
        this.filterData.page += 1
        event ? event.target.complete() : this.loading = false;
        console.log('loading should dismiss');
        this.users = await this.sortUserList(this.users, this.selectedUsers);
        if (this.filterData.page > Math.ceil(data.count / this.filterData.limit)) {
          this.disableInfiniteScroll = true;
        }


      },
        err => {
          this.loading = false;
          this.alertService.presentAlert("",
            err.error.message);
        }
      );
  }

  async closeModal(sendData) {
    if (sendData) {
      if (this.type === 'poc') {
        await this.modalController.dismiss(this.selectedUsers);
      } else {
        await this.modalController.dismiss(this.selectedUsers);
      }
    } else {
      await this.modalController.dismiss();
    }

  }
  resetFilterAndSearch() {
    this.users = [];
    this.filterData.page = 1;
    this.disableInfiniteScroll = false;
    this.searchUsers('');
  }

  async getContactPointsIds(persons){
    return persons.map(person => person._id);
  }

  // SHOW SELECTED USER PRIOR
  sortUserList(users: any, selectedUsers: Array<any>){
    // find the selected users through id
    const taggedUsers = users.filter((user: any) => selectedUsers.includes(user._id));

    // remove selected user from the original place
    const remainingUsers = users.filter((user: any) => !selectedUsers.includes(user._id));

    // add the selected user to prior of usersList
    return taggedUsers.concat(remainingUsers);
  }

  checkForUser(usr) {
    return this.selectedUsers.indexOf(usr._id) >= 0 ? true : false
    // return this.selectedUsers.filter(user => user._id === usr._id).length > 0 ? true : false;
  }


}
