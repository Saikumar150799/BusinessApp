import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassPage } from './gatepass.page';

describe('GatepassPage', () => {
  let component: GatepassPage;
  let fixture: ComponentFixture<GatepassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatepassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
