import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinInFormPage } from './checkin-in-form.page';

describe('CheckinInFormPage', () => {
  let component: CheckinInFormPage;
  let fixture: ComponentFixture<CheckinInFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinInFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinInFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
