import { TestBed } from '@angular/core/testing';

import { FacilityBookingService } from './facility-booking.service';

describe('FacilityBookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacilityBookingService = TestBed.get(FacilityBookingService);
    expect(service).toBeTruthy();
  });
});
