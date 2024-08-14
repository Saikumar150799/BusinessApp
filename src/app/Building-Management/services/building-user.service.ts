import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class BuildingUserService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getUsers(): Observable<any> {

    return this.http.get(`${this.appSettings.getApi()}/api/user/type?fields=firstName&fields=lastName&fields=types&fields=_id&status=active&types=vendor&types=employee&types=contract-employee&types=technician&types=admin&types=housekeeper`,
       this.appSettings.getHttpHeadesWithToken()
    );
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

}
