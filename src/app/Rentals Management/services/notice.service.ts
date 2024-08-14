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

    return this.http.get(`${this.appSettings.getApi()}/api/discussion?page=${filterData.page}&limit=${filterData.limit}&populate=files&sort=-createdAt&status=active`,
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
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}?populate=files&populate=selectedProjects`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

  getAllComments(id) {
    console.log(id);
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/comments?sort=-createdAt`,
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

  getSeenUserById(id: string) {
    return this.http.get(`${this.appSettings.getApi()}/api/discussion/${id}/seen-by?populate=seenBy`,
      this.appSettings.getHttpHeadesWithToken()
    );
  }

}
