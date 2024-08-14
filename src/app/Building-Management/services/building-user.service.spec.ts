import { TestBed } from '@angular/core/testing';
import { BuildingUserService } from './building-user.service';


describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingUserService = TestBed.get(BuildingUserService);
    expect(service).toBeTruthy();
  });
});
