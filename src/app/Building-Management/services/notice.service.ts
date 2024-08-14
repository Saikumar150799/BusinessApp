import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  getNotices(filterData): Observable<any> {

    console.log(filterData);

    return this.http.get(`${this.appSettings.getApi()}/api/discussion?skip=${filterData.skip}&limit=5&populate=files`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }
  likeNotice(id) {
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/like`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getNoticeById(id) {
    console.log(id);
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}?&populate=files`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  getAllComments(id) {
    console.log(id);
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/comments`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  createComment(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/comment`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  deleteComment(id) {
    console.log(id);
    return this.http.delete(`${this.appSettings.getApi()}/api/comment/${id}`,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

  createNotice(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/discussion`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }

}
