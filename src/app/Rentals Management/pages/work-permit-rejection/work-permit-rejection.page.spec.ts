import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPermitRejectionPage } from './work-permit-rejection.page';

describe('WorkPermitRejectionPage', () => {
  let component: WorkPermitRejectionPage;
  let fixture: ComponentFixture<WorkPermitRejectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkPermitRejectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkPermitRejectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
