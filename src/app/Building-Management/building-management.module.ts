import { NgModule } from '@angular/core';
import { BuildingManagementComponent } from './building-management.component';
import { IonicModule } from '@ionic/angular';
import { BuildingManagementRoutingModule } from './building-management-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { TicketFilterPageModule } from './pages/ticket-filter/ticket-filter.module';
import { UnitSearchPageModule } from './pages/unit-search/unit-search.module';
import { ProjectSearchPageModule } from './pages/project-search/project-search.module';
import { UserSearchPageModule } from './pages/user-search/user-search.module';
import { TicketCategorySearchPageModule } from './pages/ticket-category-search/ticket-category-search.module';
import { TicketSubCategorySearchPageModule } from './pages/ticket-sub-category-search/ticket-sub-category-search.module';
import { MaterialSearchPageModule } from './pages/material-search/material-search.module';
import { NoticeCreatePageModule } from './pages/notice-create/notice-create.module';
import { ApplicationPageModule } from './ApplicationPageModule';
import { ProfilePage } from './pages/profile/profile.page';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Push } from '@ionic-native/push/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { UserSearchPipe } from './pipes/user-search-pipe';

@NgModule({
    declarations: [
        BuildingManagementComponent,
        UserSearchPipe,
    ],
    imports: [
        IonicModule.forRoot(),
        BuildingManagementRoutingModule,
        HttpClientModule,
        TicketFilterPageModule,
        UnitSearchPageModule,
        ProjectSearchPageModule,
        UserSearchPageModule,
        TicketCategorySearchPageModule,
        TicketSubCategorySearchPageModule,
        MaterialSearchPageModule,
        NoticeCreatePageModule,
        ApplicationPageModule,
    ],
    providers: [
        Camera,
        FileTransfer,
        Push,
        FileTransferObject,
        ProfilePage,
    ],
    bootstrap: [BuildingManagementComponent]
})
export class BuildingManagementModule { }
