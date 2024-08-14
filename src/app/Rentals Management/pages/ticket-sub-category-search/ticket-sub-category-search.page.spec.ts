import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSubCategorySearchPage } from './ticket-sub-category-search.page';

describe('TicketSubCategorySearchPage', () => {
  let component: TicketSubCategorySearchPage;
  let fixture: ComponentFixture<TicketSubCategorySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSubCategorySearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSubCategorySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
