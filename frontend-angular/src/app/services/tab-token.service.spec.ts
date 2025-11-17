import { TestBed } from '@angular/core/testing';

import { TabTokenService } from './tab-token.service';

describe('TabTokenService', () => {
  let service: TabTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
