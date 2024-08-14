import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Filter'
})

export class FilterPipe implements PipeTransform {
    transform(conCode: any, searchTerm: string): any[] {
        if (!conCode) return [];
        if (!searchTerm) return conCode;
        searchTerm = searchTerm.toLowerCase()
        return conCode.filter(it => {
            return it.country.toLowerCase().includes(searchTerm);
        });
    }
}
