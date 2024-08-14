import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getProjects(filterData): Observable<any> {
    console.log(filterData);

    return this.http.get(`${this.appSettings.getApi()}/api/project?q=${filterData.searchText}&limit=${filterData.limit}&page=${filterData.page}`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

}
