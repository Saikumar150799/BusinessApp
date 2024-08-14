import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getUnits(filterData): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/home/indexV2?limit=${filterData.limit}&q=${filterData.searchText}&occupancyStatus=${filterData.occupancyStatus}&page=${filterData.page}&status=active&status=upcoming${filterData.projectId ? '&projects=' + filterData.projectId : ''}&type=${filterData.types}`,
    this.appSettings.getHttpHeadesWithToken())
  }

   getUnitsByHomeId(filterData, homeId): Observable<any> {

    let organizationType = window.localStorage.getItem('organizationType') || 'residential';
    
    return organizationType === 'residential' ? 
    this.http.get(`${this.appSettings.getApi()}/api/home?limit=${filterData.limit}&q=${filterData.searchText}&page=${filterData.page}`,
    this.appSettings.getHttpHeadesWithToken())
    : 
    this.http.get(`${this.appSettings.getApi()}/api/home/${homeId}/listings?limit=${filterData.limit}&q=${filterData.searchText}&page=${filterData.page}`,
    this.appSettings.getHttpHeadesWithToken())
  }

}
