
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Push } from '@ionic-native/push/ngx';
import { MainAppSetting } from './conatants/MainAppSetting';
import { BuildingManagementModule } from './Building-Management/building-management.module';
import { RentalsManagementModule } from './Rentals Management/rental-management.module';
import { UserSearchPipe } from './Rentals Management/pipes/user-search-pipe';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { StorageService } from './common-services/storage-service.service';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { OrgModalComponent } from './common-components/org-modal/org-modal.component';
import { CountrycodemodalComponent } from './login/countrycodemodal/countrycodemodal.component';
import { FilterPipe } from './login/countrycodemodal/Filter.pipe';
import { FormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx'
import { OrderModule } from 'ngx-order-pipe'
import { PictureComponent } from './common-components/picture/picture.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import { AvatarModule } from 'ngx-avatar';
// import { MyDataTenantComponent } from './Rentals Management/mydata/components/my-data-tenant-component/my-data-tenant-component.component';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
import { LanguageComponent } from './Rentals Management/components/language/language.component';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SeenNoticeUsersComponent } from './Rentals Management/modals/seen-notice-users/seen-notice-users.component';
import { SelectedProjectListComponent } from './Rentals Management/modals/selected-project-list/selected-project-list.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import {SortFilterComponent } from "./Rentals Management/modals/sort-filter/sort-filter.component"
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SignaturePadComponent } from './Rentals Management/components/signature-pad/signature-pad.component';
import { ChecklistDropDownComponent } from './Rentals Management/components/checklist-drop-down/checklist-drop-down.component';
import { SuccessAlertModalComponent } from './Rentals Management/modals/success-alert-modal/success-alert-modal.component';
import { File } from '@ionic-native/file/ngx';
import { GatepassFilterComponent } from './Rentals Management/modals/gatepass-filter/gatepass-filter.component';
import { UnitSearchComponent } from './Rentals Management/components/unit-search/unit-search.component';
import { AddNoteComponent } from './Rentals Management/components/add-note/add-note.component';
import { AddPhotoComponent } from './Rentals Management/components/add-photo/add-photo.component';
import { ChecklistSummaryComponent } from './Rentals Management/components/checklist-summary/checklist-summary.component';
import { ViewPhotoComponent } from './Rentals Management/components/view-photo/view-photo.component';
import { FeedbackComponent } from './Rentals Management/modals/feedback/feedback.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { WorkPermitFilterComponent } from './Rentals Management/modals/work-permit-filter/work-permit-filter.component';
import { WorkStatusDropDownComponent } from './Rentals Management/components/work-status-drop-down/work-status-drop-down.component';
import { GeneralDropDownComponent } from './Rentals Management/components/general-drop-down/general-drop-down.component';
import { TicketReOpenComponent } from './Rentals Management/components/ticket-re-open/ticket-re-open.component';
import { TicketOnHoldComponent } from './Rentals Management/components/ticket-on-hold/ticket-on-hold.component';
import { TicketFacilitySearchComponent } from './Rentals Management/modals/ticket-facility-search/ticket-facility-search.component';
import { SelectOrganizationComponent } from './Rentals Management/components/select-organization/select-organization.component';
import { SelectSignOptionComponent } from './Rentals Management/modals/select-sign-option/select-sign-option.component';
import { IonicRatingModule } from 'ionic4-rating';
import { TicketSortComponent } from './Rentals Management/modals/ticket-sort/ticket-sort.component';
import { SingalSelectionComponent } from './common-components/singal-selection/singal-selection.component';
import { ViewApprovalLevelsComponent } from './Rentals Management/components/view-approval-levels/view-approval-levels.component';

registerLocaleData(localeAr);




@NgModule({
  declarations: [
    AppComponent,
    OrgModalComponent,
    CountrycodemodalComponent,
    PictureComponent,
    FilterPipe,
    SeenNoticeUsersComponent,
    // MyDataTenantComponent,
    LanguageComponent,
    SelectedProjectListComponent,
    FeedbackComponent,
    SortFilterComponent,
    SignaturePadComponent,
    GatepassFilterComponent,
    WorkPermitFilterComponent,
    WorkStatusDropDownComponent,
    GeneralDropDownComponent,
    UnitSearchComponent,
    AddNoteComponent,
    ChecklistDropDownComponent,
    SuccessAlertModalComponent,
    AddPhotoComponent,
    ChecklistSummaryComponent,
    ViewPhotoComponent,
    TicketReOpenComponent,
    TicketOnHoldComponent,
    TicketFacilitySearchComponent,
    SelectOrganizationComponent,
    SelectSignOptionComponent,
    TicketSortComponent,
    SingalSelectionComponent,
    ViewApprovalLevelsComponent
  ],
  entryComponents: [
    OrgModalComponent,
    CountrycodemodalComponent,
    PictureComponent,
    // MyDataTenantComponent,
    LanguageComponent,
    SelectedProjectListComponent,
    FeedbackComponent,
    SeenNoticeUsersComponent,
    SortFilterComponent,
    SignaturePadComponent,
    GatepassFilterComponent,
    WorkPermitFilterComponent,
    WorkStatusDropDownComponent,
    GeneralDropDownComponent,
    UnitSearchComponent,
    AddNoteComponent,
    ChecklistDropDownComponent,
    SuccessAlertModalComponent,
    AddPhotoComponent,
    ChecklistSummaryComponent,
    ViewPhotoComponent,
    TicketReOpenComponent,
    TicketOnHoldComponent,
    TicketFacilitySearchComponent,
    SelectOrganizationComponent,
    SelectSignOptionComponent,
    TicketSortComponent,
    SingalSelectionComponent,
    ViewApprovalLevelsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserModule,
    HttpClientModule,
    AvatarModule,
    IonicRatingModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md'
    }),
    OrderModule,
    AppRoutingModule,
    BuildingManagementModule,
    RentalsManagementModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MainAppSetting,
    File,
    Camera,
    FileTransfer,
    FileTransferObject,
    HTTP,
    StorageService,
    Push,
    Device,
    FilePath,
    AndroidPermissions,
    OneSignal,
    ImagePicker,
    Geolocation,
    NativeGeocoder,
    ScreenOrientation,
    InAppBrowser,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GoogleAnalytics
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
