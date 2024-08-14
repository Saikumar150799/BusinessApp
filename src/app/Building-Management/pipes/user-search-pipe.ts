import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userSearch'
})

export class UserSearchPipe implements PipeTransform {
    transform(users: any, searchText: any): any {
        if (searchText == null) {
            return users;
        }
        return users.filter((user) => {
            return user.firstName + ' ' + user.lastName;
        });
    }
}