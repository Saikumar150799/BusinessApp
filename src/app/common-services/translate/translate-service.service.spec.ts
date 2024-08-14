import { TestBed } from '@angular/core/testing';

import { translateService } from './translate-service.service';

describe('translateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: translateService = TestBed.get(translateService);
    expect(service).toBeTruthy();
  });
});
