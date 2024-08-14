import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-my-data-project-filter',
  templateUrl: './my-data-project-filter.component.html',
  styleUrls: ['./my-data-project-filter.component.scss'],
})
export class MyDataProjectFilterComponent implements OnInit {

  constructor(
    private popOverCtrl: PopoverController
  ) { }
  @Input() data: any
  ngOnInit() {
    console.log('====================================');
    console.log(this.data);
    console.log('====================================');
  }
  async close(filter) {
    this.popOverCtrl.dismiss(filter);
  }
}
