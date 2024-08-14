import { TestBed } from '@angular/core/testing';

import { EstimateService } from './estimate.service';

describe('EstimateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstimateService = TestBed.get(EstimateService);
    expect(service).toBeTruthy();
  });
});
