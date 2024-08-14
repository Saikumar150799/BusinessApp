import { TestBed } from '@angular/core/testing';

import { GatePassService } from './gate-pass.service';

describe('GatePassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatePassService = TestBed.get(GatePassService);
    expect(service).toBeTruthy();
  });
});
