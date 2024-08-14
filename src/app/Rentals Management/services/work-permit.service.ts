import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { MainAppSetting } from "src/app/conatants/MainAppSetting";

@Injectable({
  providedIn: "root",
})
export class WorkPermitService {
  constructor(private http: HttpClient, public appSettings: MainAppSetting) {}

  public getWorkPermits(data): Observable<any> {
    let formattedWorkStartDate, formattedWorkEndDate, formattedCreatedDate;
    if (data.workStartDate) {
      formattedWorkStartDate = moment(data.workStartDate)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISOString();
    }
    if (data.workEndDate) {
      formattedWorkEndDate = moment(data.workEndDate)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISOString();
    }
    if (data.createdDate) {
      formattedCreatedDate = moment(data.createdDate)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISOString();
    }
    return this.http.get(
      `${this.appSettings.getApi()}/api/work-permit?q=${data.searchText}&page=${
        data.page
      }&limit=10${
        data.tenants.length > 0
          ? `&belongsTo=Tenant&belongsToRefId=` + data.tenants
          : ""
      }${data.listings.length > 0 ? `&listings=` + data.listings : ""}${
        data.approvalStatus.length > 0
          ? `&approvalStatus=` + data.approvalStatus
          : ""
      }${data.workStatus.length > 0 ? `&workStatus=` + data.workStatus : ""}${
        data.createdDate
          ? `&createdStartDate=${formattedCreatedDate}&createdEndDate=${formattedCreatedDate}`
          : ""
      }${
        data.workStartDate
          ? `&workStartDateStart=${formattedWorkStartDate}&workStartDateEnd=${formattedWorkStartDate}`
          : ""
      }${
        data.workEndDate
          ? `&workEndDateStart=${formattedWorkEndDate}&workEndDateEnd=${formattedWorkEndDate}`
          : ""
      }${data.user}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public getWorkPermitById(workPermitId, populate): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/work-permit/${workPermitId}?populate=${populate}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public approve({ workPermit, status,  rejectionReason = "" }): Observable<any> {

    return this.http.patch(
      `${
        (this, this.appSettings.getApi())
      }/api/work-permit/approve-reject/${workPermit}`,
      {
        sendEmail: true,
        reason: rejectionReason,
        status,
      },
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public reject({ workPermit, rejectionReason = "", status }): Observable<any> {

    return this.http.patch(
      `${this.appSettings.getApi()}/api/work-permit/approve-reject/${workPermit}`,
      {
        sendEmail: true,
        reason: rejectionReason,
        status,
      },
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public updateWorkStatus(
    { workPermit, rejectionReason },
    workStatus
  ): Observable<any> {
    return this.http.patch(
      `${this.appSettings.getApi()}/api/work-permit/work-status/${workPermit}`,
      {
        workStatus,
        rejectionReason,
      },
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  public downloadWorkPermit({
    workPermit,
    email,
    isLambdaTrigger,
  }): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/work-permit/download-work-permit/${workPermit}?isLambdaTrigger=${isLambdaTrigger}&email=${email}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
}
