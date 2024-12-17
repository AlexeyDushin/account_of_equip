import { TestBed } from '@angular/core/testing';

import { EquiptypesService } from './equiptypes.service';

describe('EquiptypesService', () => {
  let service: EquiptypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquiptypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
