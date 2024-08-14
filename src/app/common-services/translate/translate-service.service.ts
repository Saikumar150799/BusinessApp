import { Injectable, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core"
import * as LocaleFile from '../../conatants/LOCALE_STRING.json'
@Injectable({
  providedIn: 'root'
})
export class translateService implements OnInit {

  constructor(
    private translate: TranslateService,
  ) { }
  public localFile: any = LocaleFile
  public currencyCode: string = "UAE"

  ngOnInit() { }
  
  getTranslatedData(key: string) {
    return this.translate.instant(key);
  }


  public getCurrentLanguage(): string {
    return this.translate.currentLang
  }


  public getCurrentDirection(): string {
    return document.body.style.getPropertyValue('--direction')
  }


  public arabic(num: any): string {   // ********** Used to convert number into different language using locale **********
    let x: number = parseInt(num)
    return this.translate.currentLang === "ar" ? x.toLocaleString('ar-EG') : x.toLocaleString('en-US')
  }

  // public getNumberFormat(number: number) {
  //   return Intl.NumberFormat(this.localFile.default[this.currencyCode] ? this.localFile.default[this.currencyCode] : 'en-IN', { style: 'currency', currency: this.localFile.default[this.currencyCode] ? this.currencyCode : 'INR' }).format(number ? number : 0)
  // }
  public getNumberFormat(number: number) {
    return Intl.NumberFormat(this.localFile.default[this.currencyCode] ? this.localFile.default[this.currencyCode] : 'en-IN', { style: 'currency', currency: this.localFile.default[this.currencyCode] ? this.currencyCode : 'INR' }).format(number ? number : 0)
  }

}
