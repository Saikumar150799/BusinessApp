import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Device } from '@ionic-native/device/ngx';

@Pipe({
  name: 'imageHelper'
})
export class ImageHelperPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer,
    private device: Device
  ) {

  }
  transform(value: string): any {
    if (value) {
      return this.device.platform && this.device.platform.toLowerCase() === 'ios' ?
        this.domSanitizer.bypassSecurityTrustUrl(value) :
        value
    }

  }

}
