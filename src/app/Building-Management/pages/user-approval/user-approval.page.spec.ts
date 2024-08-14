import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApprovalPage } from './user-approval.page';

describe('UserApprovalPage', () => {
  let component: UserApprovalPage;
  let fixture: ComponentFixture<UserApprovalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserApprovalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserApprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
