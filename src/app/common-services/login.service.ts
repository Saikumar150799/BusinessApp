import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jsonFile from '../conatants/organization.json';
import { MainAppSetting } from '../conatants/MainAppSetting.js';


const appFor = jsonFile.connectTo;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    public http: HttpClient,
    public appSettings: MainAppSetting
  ) {
  }
  public appFor = appFor;

  checkPlatform(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/shared-resource/authentication/common-auth`, data, this.appSettings.getHttpHeades());
  }

  needHelp(data): Observable<any> {
    let API = ''
    if (this.appFor == 'alpha') {
      API = 'http://52.77.238.169';
    } else if (this.appFor == 'production') {
      API = 'https://thehousemonk.com';
    }
    return this.http.post(`${API}/shared-resource/webhook/support/email`, data, this.appSettings.getHttpHeades());
  }

  register(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/register`, data, this.appSettings.getHttpHeades());
  }

  commonAuth(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/common-auth`, data, this.appSettings.getHttpHeades());
  }

  signIn(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/login`, data, this.appSettings.getHttpHeades());
  }

  login(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/v2/login`, data, this.appSettings.getHttpHeades());
  }

  verifyOtp(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/verify-otp`, data, this.appSettings.getHttpHeades());
  }

  sendOtp(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/send-otp`, data, this.appSettings.getHttpHeades());
  }

  reserPassword(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/reset-password`, data, this.appSettings.getHttpHeades());
  }

  verifyPhone(data) {
    console.log("Step 6 --------- verify phone service called----")
    return this.http.post(`${this.appSettings.getApi()}/api/verify-phone`, data, this.appSettings.getHttpHeades());
  }

  validatePassword(data): Observable<any> {
    return this.http.post(`${this.appSettings.getApi()}/api/validate-password`, 
    data,
    this.appSettings.getHttpHeades());
  }
}
