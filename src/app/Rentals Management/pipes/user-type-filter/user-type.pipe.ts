import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: any): any {
    switch (value) {
      case 'admin':
        return 'Admin';
      case 'owner':
        return 'Owner';
      case 'tenant':
        return 'Tenant';
      case 'property-manager':
        return 'Property Manager';
      case 'vendor':
        return 'Vendor';
      case 'contract-employee':
        return 'Contract Employee';
      case 'employee':
        return 'Site Manager';
      case 'technician':
        return 'Technician';
      case 'gatekeeper':
        return 'Security';
      case 'housekeeper':
        return 'HouseKeeper';
      case 'all':
        return 'All';
      default:
        return value;
    }
  }

}
