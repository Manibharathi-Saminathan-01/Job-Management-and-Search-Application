import { TestBed } from '@angular/core/testing';

import { ServiceForMenuService } from './service-for-menu.service';

describe('ServiceForMenuService', () => {
  let service: ServiceForMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceForMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
