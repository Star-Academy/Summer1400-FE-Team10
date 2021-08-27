import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageServiceService} from '../services/storage-service.service';
import {LoginService} from './login.service';

const loginOptions: any = {
  username: {
    regex: [new RegExp(/^[A-Za-z\d]{4,16}$/), 'می تواند 4 تا 16 حرف انگلیسی یا رقم باشد'],
  },
  password: {
    regex: [
      new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
      'می تواند 8 تا 16 حرف انگلیسی شامل حداقل یک رقم باشد',
    ],
  },
  /*
  email: {
    regex: [new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), 'ایمیل معتبر نمی باشد'],
  },*/
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = true;
  errors: any = {};
  loading: boolean = false;

  constructor(private loginService: LoginService, private storage: StorageServiceService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.clearErrors();
    const values: any = {
      username: this.username,
      password: this.password,
    };

    let ok = true;
    Object.keys(values).forEach((ename) => {
      try {
        const reg = loginOptions[ename].regex;
        if (!reg[0].test(values[ename])) {
          this.errors[ename] = reg[1];
          ok = false;
        }
      } catch {}
    });
    if (!ok) return;

    this.loading = true;
    this.loginService.login(this.username, this.password).subscribe(
      (res) => {
        this.storage.localLogin(res).then(() => {
          this.router.navigate(['/']);
          console.log(res);
          this.loading = false;
        });
      },
      (err) => {
        console.log(err);
        this.errors.main = err.error.message;
        this.loading = false;
      }
    );
  }

  clearErrors() {
    this.errors = {};
  }
}
