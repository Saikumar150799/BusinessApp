import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSearchPage } from './project-search.page';

describe('ProjectSearchPage', () => {
  let component: ProjectSearchPage;
  let fixture: ComponentFixture<ProjectSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
