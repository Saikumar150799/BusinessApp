import { TestBed } from '@angular/core/testing';
import { RentalsUserService } from './rentals-user.service';


describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RentalsUserService = TestBed.get(RentalsUserService);
    expect(service).toBeTruthy();
  });
});
