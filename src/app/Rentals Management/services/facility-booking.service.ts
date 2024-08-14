import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { MainAppSetting } from "src/app/conatants/MainAppSetting";

@Injectable({
  providedIn: "root",
})
export class FacilityBookingService {
  constructor(private http: HttpClient, public appSettings: MainAppSetting) {}
  getBookings(
    { limit, bookingPage, searchTextBooking },
    { status, projects, sort }
  ): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/facility-booking/v2?limit=${limit}&page=${bookingPage}&q=${searchTextBooking}${
        status.length != 0 ? "&status=" + status : ""
      }&projects=${projects}&sort=${sort}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
getBookingsHistory(
  { limit, bookingPage, searchTextBooking,searchBy },
    { status, projects, sort,facility,startDate,endDate }
): Observable<any>{
     return searchTextBooking? this.http.get(
      `${this.appSettings.getApi()}/api/facility-booking/search/v4?accountBelongsTo=${searchBy}&accountBelongsToRefId=${searchTextBooking}&limit=${limit}&page=${bookingPage}${startDate ?`&startDate=${startDate}&`:""}${endDate ?`endDate=${endDate}`:""}${
        status.length != 0 ? "&status=" + status : ""
      }&projects=${projects}&sort=${sort}&populate=user&populate=participants`,
      this.appSettings.getHttpHeadesWithToken()
    ):
    this.http.get(
      `${this.appSettings.getApi()}/api/facility-booking/search/v4?accountBelongsTo=${searchBy}&accountBelongsToRefId=${facility}&limit=${limit}&page=${bookingPage}${startDate ?`&startDate=${startDate}&`:""}${endDate ?`endDate=${endDate}`:""}${
        status.length != 0 ? "&status=" + status : ""
      }&projects=${projects}&sort=${sort}&populate=user&populate=participants`,
      this.appSettings.getHttpHeadesWithToken()
    )
}
  getFacilities(
    { limit, facilityPage, searchTextFacility },
    { status, category, projects, sort }
  ): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/facility?q=${searchTextFacility}&limit=${limit}&page=${facilityPage}&status=${status}&category=${category}&projects=${projects}&sort=${sort}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getProperties({ searchTextProperty, limit, page }): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/project/search?q=${searchTextProperty}&limit=${limit}&page=${page}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getFacilityById(facilityId): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/facility/${facilityId}?populate=project&populate=custodian`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
  getBookingDetails(facilityId,{ status, projects, sort }): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/facility/${facilityId}/booking-history?sort=${sort}&status=${status}&populate=user&populate=participants`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
  getChangeStatus(bookingId, data: any): Observable<any> {
    return this.http.put(
      `${this.appSettings.getApi()}/api/facility-booking/${bookingId}`,
      data,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
  getProject(Id): Observable<any> {
    return this.http.get(
      `${this.appSettings.getApi()}/api/project/${Id}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }
  
}
