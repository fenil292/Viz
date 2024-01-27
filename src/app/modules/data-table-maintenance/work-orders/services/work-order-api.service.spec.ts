import { TestBed } from '@angular/core/testing';

import { WorkOrderApiService } from './work-order-api.service';

describe('WorkOrderApiService', () => {
  let service: WorkOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
