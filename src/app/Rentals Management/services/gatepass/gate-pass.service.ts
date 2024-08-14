import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: "root",
})
export class GatePassService {
  constructor(private http: HttpClient, public appSettings: MainAppSetting) {}

  public getGatePasses(data): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/gate-pass?q=${data.searchText}&page=${data.page}&limit=10&movementType=${data.gatepassBelongsTo}${data.listings.length>0 ? `&listings=`+data.listings : '' }&approvalStatus=${data.status}${data.user}${data.inwardDate ? `&inwardStartDate=${moment(data.inwardDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}&inwardEndDate=${moment(data.inwardDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}` : '' }${data.createdDate ? `&createdStartDate=${moment(data.createdDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}&createdEndDate=${moment(data.createdDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}` : '' }${data.outwardDate ? `&outwardStartDate=${moment(data.outwardDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}&outwardEndDate=${moment(data.outwardDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()}` : '' }`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public getListings(page, limit, searchText) {
    return this.http.get(
      `${this.appSettings.getApi()}/api/listing?page=${page}&limit=${limit}&q=${searchText}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public approvalGetGatePasses(userId): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/gate-pass?user=${userId}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public getGatePassById(gatePassId): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/gate-pass/${gatePassId}?populate=createdBy&populate=approval.actionTakenBy`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public approve({gatePass, rejectionReason = ''}): Observable<any> {
    return this.http.put(
      `${(this, this.appSettings.getApi())}/api/gate-pass/approve/${gatePass}`,
      {
        sendEmail: true,
        remarks: rejectionReason
      },
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public reject({gatePass, rejectionReason}): Observable<any> {
    return this.http.put(
      `${this.appSettings.getApi()}/api/gate-pass/reject/${gatePass}`,
      {
        sendEmail: true,
        rejectionReason
      },
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public downloadGatePass({gatePass, email, isLambdaTrigger}): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/gate-pass/${gatePass}/download-gatepass?isLambdaTrigger=${isLambdaTrigger}&email=${email}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
}
