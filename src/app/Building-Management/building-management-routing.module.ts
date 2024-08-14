import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'building-management-home',
        pathMatch: 'full'
    },
    { path: 'building-management-home', loadChildren: '../Building-Management/pages/home/home.module#HomePageModule' },
    { path: 'building-management-profile', loadChildren: '../Building-Management/pages/profile/profile.module#ProfilePageModule' },
    { path: 'building-management-tickets', loadChildren: '../Building-Management/pages/tickets/tickets.module#TicketsPageModule' },
    { path: 'building-management-calendar', loadChildren: '../Building-Management/pages/calendar/calendar.module#CalendarPageModule' },
    { path: 'building-management-create-ticket', loadChildren: '../Building-Management/pages/create-ticket/create-ticket.module#CreateTicketPageModule' },
    { path: 'building-management-ticket-filter', loadChildren: '../Building-Management/pages/ticket-filter/ticket-filter.module#TicketFilterPageModule' },
    { path: 'building-management-user-search', loadChildren: '../Building-Management/pages/user-search/user-search.module#UserSearchPageModule' },
    { path: 'building-management-project-search', loadChildren: '../Building-Management/pages/project-search/project-search.module#ProjectSearchPageModule' },
    { path: 'building-management-unit-search', loadChildren: '../Building-Management/pages/unit-search/unit-search.module#UnitSearchPageModule' },
    { path: 'building-management-ticket-category-search', loadChildren: '../Building-Management/pages/ticket-category-search/ticket-category-search.module#TicketCategorySearchPageModule' },
    { path: 'building-management-ticket-sub-category-search', loadChildren: '../Building-Management/pages/ticket-sub-category-search/ticket-sub-category-search.module#TicketSubCategorySearchPageModule' },
    { path: 'building-management-ticket-details', loadChildren: '../Building-Management/pages/ticket-details/ticket-details.module#TicketDetailsPageModule', runGuardsAndResolvers: 'always' },
    { path: 'building-management-material-search', loadChildren: '../Building-Management/pages/material-search/material-search.module#MaterialSearchPageModule' },
    { path: 'building-management-notice-board', loadChildren: '../Building-Management/pages/notice-board/notice-board.module#NoticeBoardPageModule' },
    { path: 'building-management-notice-details', loadChildren: '../Building-Management/pages/notice-details/notice-details.module#NoticeDetailsPageModule' },
    { path: 'building-management-user-approval', loadChildren: '../Building-Management/pages/user-approval/user-approval.module#UserApprovalPageModule' },
    { path: 'building-management-contact-us', loadChildren: '../Building-Management/pages/contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'building-management-estimate', loadChildren: '../Building-Management/pages/estimate/estimate.module#EstimatePageModule' },
    { path: 'building-management-my-data-project', loadChildren: '../Building-Management/mydata/project/project-search/my-data-project.module#MyDataProjectPageModule' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class BuildingManagementRoutingModule { }
