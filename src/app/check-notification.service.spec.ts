import { TestBed } from '@angular/core/testing';

import { CheckNotificationService } from './check-notification.service';

describe('CheckNotificationService', () => {
  let service: CheckNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
