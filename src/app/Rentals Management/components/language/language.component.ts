import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { translateService } from 'src/app/common-services/translate/translate-service.service';
import * as orgFile from '../../../conatants/organization.json';
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

  constructor(
    private popOverCtrl: PopoverController,
    // tslint:disable-next-line: no-shadowed-variable
    public translateService: translateService
  ) { }
  @Input() lang: any;
  public languageArray: Array<{ locale: string, name: string, imagePath: string }> = [
    {
      locale: 'en',
      name: 'English',
      imagePath: '../../assets/lang-icons/USA.png'
    },
    // {
    //   locale: 'ar',
    //   name: 'عربى',
    //   imagePath: '../../assets/lang-icons/kuwait.png'
    // },
    {
      locale: 'pt',
      name: 'Português',
      imagePath: './assets/lang-icons/portugal.svg'
    }
  ];
  ngOnInit() {
    console.log('====================================');
    console.log(this.lang);
    console.log('====================================');
  }
  async close(filter) {
    this.popOverCtrl.dismiss(filter);
  }
}
