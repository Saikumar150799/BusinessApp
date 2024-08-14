import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeBoardPage } from './notice-board.page';

describe('NoticeBoardPage', () => {
  let component: NoticeBoardPage;
  let fixture: ComponentFixture<NoticeBoardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeBoardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
