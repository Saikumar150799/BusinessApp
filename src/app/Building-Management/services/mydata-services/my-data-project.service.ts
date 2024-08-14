import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyDataProjectService {

  constructor(
    private http: HttpClient,
    private appSetting: MainAppSetting
  ) { }


  getprojectList(filterData: any): Observable<any> {
    return this.http.get(`${this.appSetting.getApi()}/api/project?searchText=${filterData.searchText}&limit=${filterData.limit}&skip=${filterData.skip}&sort=createdAt&status=${filterData.status}`, this.appSetting.getHttpHeadesWithToken())
  }
}
