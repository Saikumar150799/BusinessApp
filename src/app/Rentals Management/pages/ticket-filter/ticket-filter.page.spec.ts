import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFilterPage } from './ticket-filter.page';

describe('TicketFilterPage', () => {
  let component: TicketFilterPage;
  let fixture: ComponentFixture<TicketFilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
