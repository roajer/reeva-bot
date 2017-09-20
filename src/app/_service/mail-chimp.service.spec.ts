import { TestBed, inject } from '@angular/core/testing';

import { MailChimpService } from './mail-chimp.service';

describe('MailChimpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailChimpService]
    });
  });

  it('should be created', inject([MailChimpService], (service: MailChimpService) => {
    expect(service).toBeTruthy();
  }));
});
