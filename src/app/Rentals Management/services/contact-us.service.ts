import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainAppSetting } from 'src/app/conatants/MainAppSetting';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private http: HttpClient,
    private appSettings: MainAppSetting
  ) { }

  createContactUs(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/support/help/send-troubleshoot-mail`, data,
       this.appSettings.getHttpHeadesWithToken()
    );
  }
}
