import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveNoticePage } from './give-notice.page';

describe('GiveNoticePage', () => {
  let component: GiveNoticePage;
  let fixture: ComponentFixture<GiveNoticePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveNoticePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveNoticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
