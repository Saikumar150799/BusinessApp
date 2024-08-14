import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeCreatePage } from './notice-create.page';

describe('NoticeCreatePage', () => {
  let component: NoticeCreatePage;
  let fixture: ComponentFixture<NoticeCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
