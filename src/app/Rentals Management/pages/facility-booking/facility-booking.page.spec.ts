import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityBookingPage } from './facility-booking.page';

describe('FacilityBookingPage', () => {
  let component: FacilityBookingPage;
  let fixture: ComponentFixture<FacilityBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
