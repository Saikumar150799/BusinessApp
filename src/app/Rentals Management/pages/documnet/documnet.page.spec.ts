import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumnetPage } from './documnet.page';

describe('DocumnetPage', () => {
  let component: DocumnetPage;
  let fixture: ComponentFixture<DocumnetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumnetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumnetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
