import { Injectable } from '@angular/core';
import { AlertServiceService } from './common-services/alert-service.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  public userId: string;
  public orgId: string;
  constructor(
    private alertService: AlertServiceService,
    private ga: GoogleAnalytics,
    private http: HttpClient
  ) { }


  public async initiateGoogleAnalytics(user?: string, org?: string) {

    await this.alertService.getDataFromLoaclStorage('organization').then(data => {
      this.orgId = data;
    });
    await this.alertService.getDataFromLoaclStorage('user_id').then(data => {
      this.userId = data;
    });


    this.ga.startTrackerWithId('UA-100417495-7')
      .then(() => {
        console.log('Google analytics is ready now');
        console.log('--------------- userId ------------', this.userId, user);
        console.log('--------------- orgId ------------', this.orgId, org);

        this.ga.setUserId(user ? user : this.userId);
        this.ga.addCustomDimension(1, user ? user : this.userId);
        this.ga.addCustomDimension(2, org ? org : this.orgId);
        this.ga.addCustomDimension(3, 'business_user');
        this.ga.trackView('pageview');
        this.ga.trackEvent('App label 2', 'Business app initiated', 'label');
      }).catch(e => {
        console.log('Error starting GoogleAnalytics', e);
      });
  }

  getAddress(latitude: number, longitude: number){
    const apiKey = 'AIzaSyAH3tjUqRBphM-E6jLm0Va70Dr1uOoDNBA';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    return this.http.get(apiUrl);
    }
   
}
