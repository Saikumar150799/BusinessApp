import { Component, OnInit } from '@angular/core';
import { translateService } from 'src/app/common-services/translate/translate-service.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {

  constructor(
    public transService: translateService
  ) { }

  ngOnInit() {
  }

}
