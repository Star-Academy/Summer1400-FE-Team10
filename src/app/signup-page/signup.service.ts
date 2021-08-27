import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import api_address from '../MainAPI';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string, firstname: string, lastname: string): Observable<any> {
    return this.http.post<any>(api_address + `/user/register`, {
      username,
      email,
      password,
      firstName: firstname,
      lastName: lastname,
    });
  }
}
