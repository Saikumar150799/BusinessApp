import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsSearchPage } from './assets-search.page';

describe('AssetsSearchPage', () => {
  let component: AssetsSearchPage;
  let fixture: ComponentFixture<AssetsSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
