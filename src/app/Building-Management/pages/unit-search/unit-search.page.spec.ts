import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSearchPage } from './unit-search.page';

describe('UnitSearchPage', () => {
  let component: UnitSearchPage;
  let fixture: ComponentFixture<UnitSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
