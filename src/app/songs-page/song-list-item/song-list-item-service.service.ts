import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import api_address from 'src/app/MainAPI';

@Injectable({
  providedIn: 'root',
})
export class SongListItemServiceService {
  constructor(private http: HttpClient) {}

  like(token: string, favPlaylistID: number, songID: number): Observable<any> {
    const body = {
      token,
      favPlaylistID,
      songID,
    };
    return this.http.post<any>(api_address + '/playlist/add-song', body);
  }

  dislike(token: string, favPlaylistID: number, songID: number): Observable<any> {
    const body = {
      token,
      favPlaylistID,
      songID,
    };
    return this.http.post<any>(api_address + '/playlist/remove-song', body);
  }
}
