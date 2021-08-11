const loginOptions = {
  user: {
    regex: [new RegExp(/^[A-Za-z\d]{4,16}$/), 'می تواند 4 تا 16 حرف انگلیسی یا رقم باشد'],
  },
  pass: {
    regex: [
      new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
      'می تواند 8 تا 16 حرف انگلیسی شامل حداقل یک رقم باشد',
    ],
  },
  email: {
    regex: [new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), 'ایمیل معتبر نمی باشد'],
  },
};

class loginForm {
  constructor(formId, userId, passId, showPassId, rememberId, submitId, errorBoxId) {
    this.elems = {
      form: formId,
      user: userId,
      pass: passId,
      showPass: showPassId,
      remember: rememberId,
      submit: submitId,
      errorBox: errorBoxId,
    };

    const {elems} = this;

    for (const elem in elems)
      try {
        elems[elem] = document.querySelector(elems[elem]);
      } catch {
        elems[elem] = document.createElement('span');
      }

    elems.showPass.addEventListener('change', (e) => {
      if (e.target.checked) elems.pass.setAttribute('type', 'text');
      else elems.pass.setAttribute('type', 'password');
    });

    elems.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });
  }

  clearErrors() {
    Object.values(this.elems).forEach((elem) => this.hideError(elem));
  }

  login() {
    const {elems} = this;
    const values = {
      user: elems.user.value,
      pass: elems.pass.value,
      remember: elems.remember.checked,
    };

    this.clearErrors();

    let ok = true;

    Object.keys(elems).forEach((ename) => {
      try {
        const reg = loginOptions[ename].regex;
        if (!reg[0].test(values[ename])) {
          this.setError(elems[ename], reg[1]);
          if (ok) elems[ename].focus();
          ok = false;
        }
      } catch {}
    });

    if (ok) this.sendPacket(values);
  }

  sendPacket(data) {
    const {elems} = this;
    elems.submit.setAttribute('disabled', true);
    mainServer.user
      .login(data.user, null, data.pass)
      .then((res) => {
        const {data} = res;
        this.clearErrors();
        localLogin(data);
        fillFavPlaylist();
        //window.location.replace('./home.html');
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
        this.setError(elems.errorBox, err.message);
      })
      .finally(() => {
        elems.submit.removeAttribute('disabled');
      });

    console.log(data);
  }

  getErrorElem(e) {
    try {
      return e.parentNode.querySelector('.input-error');
    } catch {
      return null;
    }
  }

  setError(elem, error) {
    const errorElem = this.getErrorElem(elem);
    if (!errorElem) return;
    errorElem.innerHTML = error;
    errorElem.classList.add('shown');
  }

  hideError(elem) {
    const errorElem = this.getErrorElem(elem);
    if (!errorElem) return;
    errorElem.innerHTML = '';
    errorElem.classList.remove('shown');
  }
}

new loginForm(
  '#login-form',
  '#username',
  '#password',
  '#show-password',
  '#remember-me',
  '#submit',
  '#main-login-error'
);
