import { TestBed } from '@angular/core/testing';

import { WorkPermitService } from './work-permit.service';

describe('WorkPermitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkPermitService = TestBed.get(WorkPermitService);
    expect(service).toBeTruthy();
  });
});
