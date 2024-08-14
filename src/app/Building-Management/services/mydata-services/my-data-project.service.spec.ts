import { TestBed } from '@angular/core/testing';

import { MyDataProjectService } from './my-data-project.service';

describe('MyDataProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyDataProjectService = TestBed.get(MyDataProjectService);
    expect(service).toBeTruthy();
  });
});
