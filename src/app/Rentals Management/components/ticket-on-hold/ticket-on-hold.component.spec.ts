import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOnHoldComponent } from './ticket-on-hold.component';

describe('TicketOnHoldComponent', () => {
  let component: TicketOnHoldComponent;
  let fixture: ComponentFixture<TicketOnHoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketOnHoldComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketOnHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
