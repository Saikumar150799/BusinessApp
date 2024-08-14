import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
@Pipe({
    name: 'agoFilter'
})

export class AgoFilter implements PipeTransform {
    constructor(
        private translate: TranslateService
    ) {

    }
    transform(conCode: any): any {
        switch (this.translate.currentLang) {
            case 'ar':
                moment.locale('ar');
                break;
            case 'pt':
                moment.locale('pt');
                break;

            default:
                moment.locale('en');
                break;
        }
        return moment(conCode).fromNow();
    }
}