import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { IonicStorageModule } from '@ionic/storage';
import { AddUserComponent } from '../common-components/add-user/add-user.component';
import { SelectOrganizationComponent } from '../common-components/select-organization/select-organization.component';
import { NeedHelpComponent } from '../common-components/need-help/need-help.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  entryComponents: [
    AddUserComponent,
    SelectOrganizationComponent,
    NeedHelpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginPage,
    AddUserComponent,
    SelectOrganizationComponent,
    NeedHelpComponent
  ]
})
export class LoginPageModule { }

