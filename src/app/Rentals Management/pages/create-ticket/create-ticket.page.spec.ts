import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketPage } from './create-ticket.page';

describe('CreateTicketPage', () => {
  let component: CreateTicketPage;
  let fixture: ComponentFixture<CreateTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
