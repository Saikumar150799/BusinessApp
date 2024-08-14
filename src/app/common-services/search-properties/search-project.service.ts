import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class SearchProjectService {

  constructor(
    private http: HttpClient,
    private appSetting: MainAppSetting
  ) { }

  searchProject(type, searchtext, skip, org, id): Observable<any> {
    //projects?limit=5&skip=0&searchText=&organization=5943d4efa3d24b443f4008a2
    return this.http.get(`http://localhost:3020/shared-resource/onboarding/${type}?limit=10&searchText=${searchtext}&skip=${skip}&${org}=${id}`,
      this.appSetting.getHttpHeades())
  }
  createUserApproval(data): Observable<any> {
    return this.http.post(`http://localhost:3020/api/approval`, data,
      this.appSetting.getHttpHeades())
  }
  // getHomeAddress(type): Observable<any> {
  // //api/home?action=onBoarding&limit=7&searchText=a&skip=0&status=onBoarding&projects=
  //   return this.http.get(`${this.appSetting.getApi()}/api/${type}`,
  //     this.appSetting.getHttpHeadesWithToken())

  // }
}


