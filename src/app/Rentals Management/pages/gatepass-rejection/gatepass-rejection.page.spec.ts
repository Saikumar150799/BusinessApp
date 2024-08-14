import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassRejectionPage } from './gatepass-rejection.page';

describe('GatepassRejectionPage', () => {
  let component: GatepassRejectionPage;
  let fixture: ComponentFixture<GatepassRejectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatepassRejectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassRejectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
