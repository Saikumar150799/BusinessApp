import { TestBed } from '@angular/core/testing';

import { CheckInCheckOutService } from './check-in-check-out.service';

describe('CheckInCheckOutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckInCheckOutService = TestBed.get(CheckInCheckOutService);
    expect(service).toBeTruthy();
  });
});
