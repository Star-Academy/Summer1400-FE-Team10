import { TestBed } from '@angular/core/testing';

import { SongListItemServiceService } from './song-list-item-service.service';

describe('SongListItemServiceService', () => {
  let service: SongListItemServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongListItemServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
