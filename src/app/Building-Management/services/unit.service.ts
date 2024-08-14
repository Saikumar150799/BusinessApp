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

    console.log(filterData);

    return this.http.get(`${this.appSettings.getApi()}/api/home?limit=10&searchText=${filterData.searchText}&skip=${filterData.skip}&status=active`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

}
