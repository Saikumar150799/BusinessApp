import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCategorySearchPage } from './ticket-category-search.page';

describe('TicketCategorySearchPage', () => {
  let component: TicketCategorySearchPage;
  let fixture: ComponentFixture<TicketCategorySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketCategorySearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCategorySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
