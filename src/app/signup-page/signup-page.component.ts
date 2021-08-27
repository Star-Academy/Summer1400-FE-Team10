import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageServiceService} from '../services/storage-service.service';
import {SignupService} from './signup.service';

const signupOptions: any = {
  username: {
    regex: [new RegExp(/^[A-Za-z\d]{4,16}$/), 'می تواند 4 تا 16 حرف انگلیسی یا رقم باشد'],
  },
  password: {
    regex: [
      new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
      'می تواند 8 تا 16 حرف انگلیسی شامل حداقل یک رقم باشد',
    ],
  },
  email: {
    regex: [new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), 'ایمیل معتبر نمی باشد'],
  },
  confirmPassword: {
    message: 'باید با رمز عبور یکسان باشد',
  },
};

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstname: string = '';
  lastname: string = '';
  showPassword: boolean = false;
  errors: any = {};
  loading: boolean = false;

  constructor(private signupService: SignupService, private storage: StorageServiceService, private router: Router) {}

  ngOnInit(): void {}

  signup() {
    console.log('hi');
    this.clearErrors();
    const values: any = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    let ok = true;
    Object.keys(values).forEach((ename) => {
      try {
        const reg = signupOptions[ename].regex;
        if (!reg[0].test(values[ename])) {
          this.errors[ename] = reg[1];
          console.log('er1', ename);
          ok = false;
        }
      } catch {}
    });
    if (!ok) return;

    if (this.password != this.confirmPassword) {
      this.errors.confirmPassword = signupOptions.confirmPassword.message;
      console.log('er2', 'conf');
      return;
    }

    this.loading = true;
    this.signupService.signup(this.username, this.email, this.password, this.firstname, this.lastname).subscribe(
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
