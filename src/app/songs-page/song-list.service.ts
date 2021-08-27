import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SongListItem} from './song-list-item';
import api_address from '../MainAPI';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongListService {
  constructor(private http: HttpClient) {}

  getPage(size: number, current: number): Observable<SongListItem> {
    const body = {
      size: 20,
      current,
      sorter: 'name',
      desc: false,
    };
    const bodyString = JSON.stringify(body);
    return this.http.post<SongListItem>(api_address + '/song/page', body);
  }
}
