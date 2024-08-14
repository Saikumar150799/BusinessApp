import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'building-management', loadChildren: '../app/Building-Management/building-management.module#BuildingManagementModule' },
  { path: 'rentals', loadChildren: '../app/Rentals Management/rental-management.module#RentalsManagementModule' },
  { path: 'login', loadChildren: '../app/login/login.module#LoginPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
