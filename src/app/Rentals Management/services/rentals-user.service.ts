import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class RentalsUserService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getUsers(type, filterData): Observable<any> {

    if (type === 'project') {
      return this.http.get(`${this.appSettings.getApi()}/api/user/type?fields=firstName&fields=lastName&fields=types&fields=_id&status=active&types=employee`,
        this.appSettings.getHttpHeadesWithToken());
    } else if (type === 'owners') {
      return this.http.get(`${this.appSettings.getApi()}/api/user/type?fields=firstName&fields=lastName&fields=types&fields=_id&status=active&types=owner`,
        this.appSettings.getHttpHeadesWithToken());
    } else if (type === 'tenants') {
      return this.http.get(`${this.appSettings.getApi()}/api/user?roleTypes=tenant&fields=firstName&fields=lastName&fields=types&fields=_id&status=active&q=${filterData.searchText}`,
        this.appSettings.getHttpHeadesWithToken());
    } else if (type === 'poc') {
      return this.http.get(`${this.appSettings.getApi()}/api/user?roleTypes=staff&roleTypes=admin&status=active&fields=firstName&fields=lastName&fields=types&fields=_id&q=${filterData.searchText}`,
        this.appSettings.getHttpHeadesWithToken());
    } else if (type === 'agent') {
      return this.http.get(`${this.appSettings.getApi()}/api/user?roleTypes=staff&fields=firstName&status=active&fields=lastName&fields=types&fields=_id&q=${filterData.searchText}`,
        this.appSettings.getHttpHeadesWithToken());
    } else {

      return this.http.get(`${this.appSettings.getApi()}/api/user?roleTypes=staff&roleTypes=admin&status=active&fields=firstName&fields=lastName&fields=types&fields=_id&q=${filterData.searchText}`,
        this.appSettings.getHttpHeadesWithToken());
    }
  }

  getUserById(id): Observable<any> {

    return this.http.get(`${this.appSettings.getApi()}/api/user/${id}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getUserApprovals(): Observable<any> {

    return this.http.get(`${this.appSettings.getApi()}/api/approval`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  updateUser(data): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/user/${data._id}`, data,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  approve(id): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/approval/${id}/approve`,
      '', this.appSettings.getHttpHeadesWithToken())
  }
  reject(id, data): Observable<any> {
    console.log(data);
    let userData = {
      notes: data
    }
    return this.http.post(`${this.appSettings.getApi()}/api/approval/${id}/reject`, userData,
      this.appSettings.getHttpHeadesWithToken())
  }


  createUser(data: FormData): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/user`, data, this.appSettings.getHttpHeadersForFormData())
  }
  updateUserData(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.appSettings.getApi()}/api/user/${id}`, data, this.appSettings.getHttpHeadersForFormData())
  }

  refreshToken(): Observable<any> {
    return this.http.get(`${this.appSettings.getApi()}/api/user/refresh-payload`, this.appSettings.getHttpHeadesWithToken());
  }
}
