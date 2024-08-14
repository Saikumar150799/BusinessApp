import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedHelpComponent } from './need-help.component';

describe('NeedHelpComponent', () => {
  let component: NeedHelpComponent;
  let fixture: ComponentFixture<NeedHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedHelpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
