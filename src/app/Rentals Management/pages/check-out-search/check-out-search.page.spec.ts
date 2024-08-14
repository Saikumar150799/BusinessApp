import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutSearchPage } from './check-out-search.page';

describe('CheckOutSearchPage', () => {
  let component: CheckOutSearchPage;
  let fixture: ComponentFixture<CheckOutSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
