import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDataProjectPage } from './my-data-project.page';

describe('MyDataProjectPage', () => {
  let component: MyDataProjectPage;
  let fixture: ComponentFixture<MyDataProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDataProjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDataProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
