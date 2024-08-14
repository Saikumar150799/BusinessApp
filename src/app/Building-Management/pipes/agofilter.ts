import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'agoFilter'
})

export class AgoFilter implements PipeTransform {
    transform(conCode: any): any {
        console.log("ago Filter", conCode);
        let m = moment(conCode).fromNow();
        return m;
    }
}