import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutFormPage } from './check-out-form.page';

describe('CheckOutFormPage', () => {
  let component: CheckOutFormPage;
  let fixture: ComponentFixture<CheckOutFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
