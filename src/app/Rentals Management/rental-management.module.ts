import { NgModule } from "@angular/core";
import { RentalsComponent } from "./rental-management.component";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { RentalsRoutingModule } from "./rental-management-routing.module";
import { TicketFilterPageModule } from "./pages/ticket-filter/ticket-filter.module";
import { UnitSearchPageModule } from "./pages/unit-search/unit-search.module";
import { HomeSearchPageModule } from "./pages/home-search/home-search.module";
import { ProjectSearchPageModule } from "./pages/project-search/project-search.module";
import { UserSearchPageModule } from "./pages/user-search/user-search.module";
import { TicketCategorySearchPageModule } from "./pages/ticket-category-search/ticket-category-search.module";
import { TicketSubCategorySearchPageModule } from "./pages/ticket-sub-category-search/ticket-sub-category-search.module";
import { MaterialSearchPageModule } from "./pages/material-search/material-search.module";
import { NoticeCreatePageModule } from "./pages/notice-create/notice-create.module";
import { ApplicationPageModule } from "./ApplicationPageModule";
import { UserSearchPipe } from "./pipes/user-search-pipe";
import { Camera } from "@ionic-native/camera/ngx";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Push } from "@ionic-native/push/ngx";
import { ProfilePage } from "./pages/profile/profile.page";
import { AssetsSearchPageModule } from "./pages/assets-search/assets-search.module";

@NgModule({
  declarations: [RentalsComponent, UserSearchPipe],
  imports: [
    RentalsRoutingModule,
    HttpClientModule,
    TicketFilterPageModule,
    UnitSearchPageModule,
    HomeSearchPageModule,
    ProjectSearchPageModule,
    UserSearchPageModule,
    TicketCategorySearchPageModule,
    TicketSubCategorySearchPageModule,
    MaterialSearchPageModule,
    NoticeCreatePageModule,
    ApplicationPageModule,
    AssetsSearchPageModule
  ],
  providers: [Camera, FileTransfer, Push, FileTransferObject, ProfilePage],
  bootstrap: [RentalsComponent],
})
export class RentalsManagementModule { }
