import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'rentals-home',
        pathMatch: 'full'
    },
    { path: 'rentals-home', loadChildren: '../Rentals Management/pages/home/home.module#HomePageModule' },
    { path: 'rentals-profile', loadChildren: '../Rentals Management/pages/profile/profile.module#ProfilePageModule' },
    { path: 'rentals-tickets', loadChildren: '../Rentals Management/pages/tickets/tickets.module#TicketsPageModule' },
    { path: 'rentals-calendar', loadChildren: '../Rentals Management/pages/calendar/calendar.module#CalendarPageModule' },
    { path: 'rentals-create-ticket', loadChildren: '../Rentals Management/pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
    { path: 'rentals-ticket-filter', loadChildren: '../Rentals Management/pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
    { path: 'rentals-user-search', loadChildren: '../Rentals Management/pages/user-search/user-search.module#UserSearchPageModule' },
    { path: 'rentals-project-search', loadChildren: '../Rentals Management/pages/project-search/project-search.module#ProjectSearchPageModule' },
    { path: 'rentals-unit-search', loadChildren: '../Rentals Management/pages/unit-search/unit-search.module#UnitSearchPageModule' },
    { path: 'rentals-ticket-category-search', loadChildren: '../Rentals Management/pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
    { path: 'rentals-ticket-sub-category-search', loadChildren: '../Rentals Management/pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
    { path: 'rentals-ticket-details', loadChildren: '../Rentals Management/pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
    { path: 'rentals-material-search', loadChildren: '../Rentals Management/pages/material-search/material-search.module#MaterialSearchPageModule' },
    { path: 'rentals-notice-board', loadChildren: '../Rentals Management/pages/notice-board/notice-board.module#NoticeBoardPageModule' },
    { path: 'rentals-notice-details', loadChildren: '../Rentals Management/pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
    { path: 'rentals-user-approval', loadChildren: '../Rentals Management/pages/user-approval/user-approval.module#UserApprovalPageModule' },
    { path: 'rentals-contact-us', loadChildren: '../Rentals Management/pages/contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'rentals-estimate', loadChildren: '../Rentals Management/pages/estimate/estimate.module#EstimatePageModule' },
  { path: 'rentals-facility-booking', loadChildren: '../Rentals Management/pages/facility-booking/facility-booking.module#FacilityBookingPageModule'},
  { path: 'rentals-facility-details', loadChildren: '../Rentals Management/pages/facility-details/facility-details.module#FacilityDetailsPageModule',runGuardsAndResolvers: 'always' },
  { path: 'checklist', loadChildren: './pages/checklist/checklist.module#ChecklistPageModule' },
  { path: 'rentals-gatepass', loadChildren: './pages/gatepass/gatepass.module#GatepassPageModule' },
  { path: 'rentals-gatepas-details', loadChildren: './pages/gatepas-details/gatepas-details.module#GatepasDetailsPageModule' },
  { path: 'rentals-gatepass-rejection', loadChildren: './pages/gatepass-rejection/gatepass-rejection.module#GatepassRejectionPageModule' },
  { path: 'rentals-check-in', loadChildren: './pages/check-in/check-in.module#CheckInPageModule' },
  { path: 'rentals-check-in-details', loadChildren: './pages/check-in-details/check-in-details.module#CheckInDetailsPageModule' },
  { path: 'rentals-documnet', loadChildren: './pages/documnet/documnet.module#DocumnetPageModule' },
  { path: 'rentals-checkin-in-form', loadChildren: './pages/checkin-in-form/checkin-in-form.module#CheckinInFormPageModule' },
  { path: 'rentals-check-out', loadChildren: './pages/check-out/check-out.module#CheckOutPageModule' },
  { path: 'rentals-check-out-search', loadChildren: './pages/check-out-search/check-out-search.module#CheckOutSearchPageModule' },
  { path: 'rentals-give-notice', loadChildren: './pages/give-notice/give-notice.module#GiveNoticePageModule' },
  { path: 'rentals-give-notice-details', loadChildren: './pages/give-notice-details/give-notice-details.module#GiveNoticeDetailsPageModule' },
  { path: 'rentals-checkout-details', loadChildren: './pages/checkout-details/checkout-details.module#CheckoutDetailsPageModule' },
  { path: 'rentals-check-out-form', loadChildren: './pages/check-out-form/check-out-form.module#CheckOutFormPageModule' },
  { path: 'rentals-invoices', loadChildren: './pages/invoices/invoices.module#InvoicesPageModule' },
  { path: 'rentals-work-permit', loadChildren: './pages/work-permit/work-permit.module#WorkPermitPageModule' },
  { path: 'rentals-work-permit-details', loadChildren: './pages/work-permit-details/work-permit-details.module#WorkPermitDetailsPageModule' },
  { path: 'rentals-work-permit-rejection', loadChildren: './pages/work-permit-rejection/work-permit-rejection.module#WorkPermitRejectionPageModule' },
  { path: 'rentals-assets-search', loadChildren: './pages/assets-search/assets-search.module#AssetsSearchPageModule' },
  { path: 'rentals-home-search', loadChildren: './pages/home-search/home-search.module#HomeSearchPageModule' },
    
    // { path: 'rentals-my-data-project', loadChildren: '../Rentals Management/mydata/project/project-search/my-data-project.module#MyDataProjectPageModule' },
    // { path: 'rentals-my-data-project-details', loadChildren: '../Rentals Management/mydata/project/project-details/project-details.module#ProjectDetailsPageModule' },
    // { path: 'rentals-my-data-project-details/:id', loadChildren: '../Rentals Management/mydata/project/project-details/project-details.module#ProjectDetailsPageModule' },
    // { path: 'rentals-my-data-unit-search', loadChildren: '../Rentals Management/mydata/Unit/my-data-unit-search/my-data-unit-search.module#MyDataUnitSearchPageModule' },
    // { path: 'rentals-my-data-unit-details/:id', loadChildren: '../Rentals Management/mydata/Unit/unit-details/unit-details.module#UnitDetailsPageModule' },
    // { path: 'rentals-my-data-unit-details', loadChildren: '../Rentals Management/mydata/Unit/unit-details/unit-details.module#UnitDetailsPageModule' },
    // { path: 'rentals-my-data-unit-create', loadChildren: '../Rentals Management/mydata/Unit/unit-create/unit-create.module#UnitCreatePageModule' },
    // { path: 'rentals-my-data-unit-tenancy-overview', loadChildren: '../Rentals Management/mydata/Unit/tenancy-overview/tenancy-overview.module#TenancyOverviewPageModule' },
    // { path: 'rentals-my-data-unit-tenancy-overview/:id', loadChildren: '../Rentals Management/mydata/Unit/tenancy-overview/tenancy-overview.module#TenancyOverviewPageModule' },
    // { path: 'rentals-my-data-unit-home-edit/:id', loadChildren: '../Rentals Management/mydata/Unit/home-edit/home-edit.module#HomeEditPageModule' },
    // { path: 'rentals-my-data-tenant-search', loadChildren: './mydata/tenant/tenant-search/tenant-search.module#TenantSearchPageModule' },
    // { path: 'rentals-my-data-tenant-details/:id', loadChildren: './mydata/tenant/tenant-details/tenant-details.module#TenantDetailsPageModule' },
    // { path: 'rentals-my-data-add-user', loadChildren: './mydata/tenant/add-user/add-user.module#AddUserPageModule' },
    // { path: 'rentals-my-data-add-user/:id', loadChildren: './mydata/tenant/add-user/add-user.module#AddUserPageModule' },
    // { path: 'rentals-my-data-user-search', loadChildren: './mydata/tenant/user-search/user-search.module#UserSearchPageModule' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RentalsRoutingModule { }
