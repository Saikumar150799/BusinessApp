import { Component } from '@angular/core';
import { ProfilePage } from './pages/profile/profile.page';

@Component({
    selector: 'Building-management-root',
    templateUrl: 'building-management.component.html'
})
export class BuildingManagementComponent {
    public appPages = {
        name: '',
        phoneNumber: localStorage.getItem('phoneNumber'),
        pages: [
            {
                title: 'Home',
                url: '/home',
                src: '/assets/icon/my-home.png'
            }, {
                title: 'Calendar',
                url: '/calendar',
                src: '/assets/icon/calendar.png'
            }, {
                title: 'Tickets',
                url: '/tickets',
                src: '/assets/icon/ticket-history.png'
            }, {
                title: 'Notice board',
                url: '/notice-board',
                src: '/assets/icon/communications.png'
            },
            {
                title: 'Approvals',
                url: '/user-approval',
                src: '/assets/icon/approval.png'
            },
            {
                title: 'Contact us',
                url: '/contact-us',
                src: '/assets/icon/phone.png'
            },
            {
                title: 'Profile',
                url: '/profile',
                src: '/assets/icon/profile.png'
            }],
        logout: {
            title: 'Logout',
            src: '/assets/icon/log-out.png',

        }

    }
    constructor(
        private profile: ProfilePage
    ) { }
    logOut() {
        this.profile.logOut();
        // this.userService.getUserById(localStorage.getItem('user_id')).subscribe((data) => {
        //   data.businessAppDevice = {};
        //   this.userService.updateUser(data).subscribe(() => {
        //     localStorage.clear();
        //     this.router.navigateByUrl('/login');
        //   });
        // })
    }
}