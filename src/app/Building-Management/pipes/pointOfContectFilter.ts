import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'PointOfContactFilter'
})
export class PointOfContact implements PipeTransform {
    transform(conCode: any, searchTerm: string): any[] {
        if (!conCode) return [];
        if (!searchTerm) return conCode;
        searchTerm = searchTerm.toLowerCase();
        return conCode.filter(it => {
            // let name:string;
            // if (it.lastName) {
            // return it.lastName.toLowerCase().includes(searchTerm);
            // } else if (it.firstName) {
            return it.firstName.toLowerCase().includes(searchTerm);
            // }

        });
    }
}