import { TestBed } from '@angular/core/testing';

import { EmpequipsService } from './empequips.service';

describe('EmpequipsService', () => {
  let service: EmpequipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpequipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
