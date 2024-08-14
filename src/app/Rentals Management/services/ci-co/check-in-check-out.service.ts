import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckInCheckOutService {

  constructor(
    public http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  // get units
  getCheckInLists({date ,type, page, searchText}): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/home/move-in?date=${date}&type=${type}&limit=10&page=${page}&q=${searchText}&skip=0`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  checkInCount(startDate, endDate): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/stats/godview/movedIn?endDate=${endDate}&limit=1&page=1&startDate=${startDate}`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  checkOutCount(startDate, endDate): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/stats/godview/movedOut?endDate=${endDate}&limit=1&page=1&startDate=${startDate}`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  getUnitDetails({unitId, showCICODetails = '', showRejectedItems = ''}): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/home/${unitId}?populate=tenants&populate=listing&showCICODetails=true${showRejectedItems}`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  onBoarding(data): Observable<any>{
    return this.http.put(`${this.appSettings.getApi()}/api/user/${data.tenant}/onboarding`, data,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  getChecklistByHome(homeId): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/checklist/items?home=${homeId}`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  checkIn(data): Observable<any>{
    return this.http.post(`${this.appSettings.getApi()}/api/checklist/check-in`,data,
    this.appSettings.getHttpHeadesWithToken('business-app')
    )
  }
  reConfirm(data): Observable<any>{
    return this.http.post(`${this.appSettings.getApi()}/api/checklist/re-confirm`,data,
    this.appSettings.getHttpHeadesWithToken('business-app')
    )
  }

  getCheckOutUnits({date,type,page,limit,searchText = ''}): Observable<any>{
    const dateValue = date ? `date=${date}` : '';
    return this.http.get(`${this.appSettings.getApi()}/api/home/move-in?${dateValue}&type=${type}&limit=${limit}&page=${page}&q=${searchText}`, 
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  giveNotice(homeId, data): Observable<any>{
    return this.http.put(`${this.appSettings.getApi()}/api/home/${homeId}/notice`, data, 
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  getInvoices({homeId}): Observable<any>{
    return this.http.get(`${this.appSettings.getApi()}/api/transaction?accountBelongsTo=Home&accountBelongsToRefId=${homeId}&limit=9007199254740991&page=1&&sort=createdAt&status=due&status=partial&status=paid&type=Invoice`,
    this.appSettings.getHttpHeadesWithToken()
    )
  }

  checkout(data): Observable<any>{
    return this.http.post(`${this.appSettings.getApi()}/api/checklist/check-out`, data, 
    this.appSettings.getHttpHeadesWithToken()
    )
  }
  submitFeedBack(data) : Observable<any>{
    console.log(data);
    return this.http.post(`${this.appSettings.getApi()}/api/checklist/feedback`, data, 
    this.appSettings.getHttpHeadesWithToken()
    )
  }
}
