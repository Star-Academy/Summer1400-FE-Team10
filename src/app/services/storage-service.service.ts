import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import api_address from '../MainAPI';

class projectStorageItem {
  name: string;
  listeners: any;

  constructor(name: string) {
    this.name = name;
    this.listeners = {};
  }

  exists() {
    return localStorage.getItem(this.name) != null;
  }
  set(t = {}) {
    try {
      localStorage.setItem(this.name, JSON.stringify(t));
      this.callListeners();
    } catch {}
  }
  get() {
    try {
      const res = localStorage.getItem(this.name);
      if (res != null) return JSON.parse(res);
    } catch {}
    return {};
  }
  clear() {
    localStorage.removeItem(this.name);
    this.callListeners();
  }

  setListener(name: string, func: any) {
    if (func) this.listeners[name] = func;
    else this.clearListener(name);
  }
  clearListener(name: string) {
    try {
      delete this.listeners[name];
    } catch {}
  }
  callListeners() {
    Object.values(this.listeners).forEach((func: any) => {
      func(this);
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  favorite_playlist_name = '__favorites__';
  user_token = new projectStorageItem('user_token');
  user_info = new projectStorageItem('user_info');
  favorite_playlist = new projectStorageItem('favorite_playlist');

  constructor(private http: HttpClient) {
    this.user_token.set({
      id: 7,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI5ODk3OTkyfQ.smLkp3Jl4sJZHjdiswmO7JV83n_TbZnxbIvGfWjLR84',
    });
    this.fillUserInfo();
  }

  fillUserInfo(): Promise<any> {
    if (this.user_token.exists() && !this.user_info.exists()) {
      const data = this.user_token.get();
      return this.http
        .get<any>(api_address + `/user/one/${data.id}`)
        .toPromise()
        .then((res) => {
          this.user_info.set(res.user);
          console.log(res);
        });
    }
    return new Promise(() => {});
  }

  localLogin(data: any) {
    this.user_token.clear();
    this.user_info.clear();
    this.user_token.set(data);
    return this.fillUserInfo();
  }

  fillFavPlaylist() {
    const token = this.user_token.get().token;

    this.http.post<any>(api_address + `/playlist/all`, {token}).subscribe((res) => {
      const list = res.data.filter((item: any) => item.name == this.favorite_playlist_name);
      if (list.length == 0) {
        this.http
          .post<any>(api_address + `/playlist/create`, {token, name: this.favorite_playlist_name})
          .subscribe((resp) => {
            this.favorite_playlist.set(resp.data);
            console.log(resp);
          });
      } else {
        this.favorite_playlist.set({id: list[0].id});
        console.log(list[0].name);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.user_token.exists();
  }
}
