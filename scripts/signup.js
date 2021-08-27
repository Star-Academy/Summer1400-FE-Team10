const signupOptions = {
  user: {
    regex: [new RegExp(/^[A-Za-z\d]{4,16}$/), 'می تواند 4 تا 16 حرف انگلیسی یا رقم باشد'],
  },
  pass: {
    regex: [
      new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/),
      'می تواند 8 تا 16 حرف انگلیسی شامل حداقل یک رقم باشد',
    ],
  },
  confPass: {
    error: 'باید با رمز عبور یکسان باشد',
  },
  email: {
    regex: [new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), 'ایمیل معتبر نمی باشد'],
  },
};

class signupForm {
  constructor(userId, emailId, passId, confPassId, showPassId, personNameId, personFamilyId, submitId, errorBoxId) {
    this.elems = {
      user: userId,
      email: emailId,
      pass: passId,
      confPass: confPassId,
      showPass: showPassId,
      personName: personNameId,
      personFamily: personFamilyId,
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
      if (e.target.checked) {
        elems.pass.setAttribute('type', 'text');
        elems.confPass.setAttribute('type', 'text');
      } else {
        elems.pass.setAttribute('type', 'password');
        elems.confPass.setAttribute('type', 'password');
      }
    });

    elems.submit.addEventListener('click', (e) => {
      e.preventDefault();
      this.signup();
    });
  }

  clearErrors() {
    Object.values(this.elems).forEach((elem) => this.hideError(elem));
  }

  signup() {
    const {elems} = this;
    const values = {
      user: elems.user.value,
      email: elems.email.value,
      pass: elems.pass.value,
      confPass: elems.confPass.value,
      personName: elems.personName.value,
      personFamily: elems.personFamily.value,
    };

    this.clearErrors();

    let ok = true;

    Object.keys(elems).forEach((ename) => {
      try {
        const reg = signupOptions[ename].regex;
        if (!reg[0].test(values[ename])) {
          this.setError(elems[ename], reg[1]);
          if (ok) elems[ename].focus();
          ok = false;
        }
      } catch {}
    });

    if (values.confPass != values.pass) {
      this.setError(elems.confPass, signupOptions.confPass.error);
      ok = false;
    }

    if (ok) this.sendPacket(values);
  }

  sendPacket(data) {
    const {elems} = this;
    elems.submit.setAttribute('disabled', true);
    mainServer.user
      .register(data.user, data.email, data.pass, data.personName, data.personFamily)
      .then((res) => {
        const {data} = res;

        this.clearErrors();
        localLogin(data);
        fillFavPlaylist();
        window.location.replace('./home.html');
        console.log('OK');
      })
      .catch((err) => {
        //console.log(err.message);
        this.setError(elems.errorBox, err.message);
      })
      .finally(() => {
        elems.submit.removeAttribute('disabled');
      });
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

new signupForm(
  '#username',
  '#email',
  '#password',
  '#conf-password',
  '#show-password',
  '#person-name',
  '#person-family',
  '#submit',
  '#main-login-error'
);
