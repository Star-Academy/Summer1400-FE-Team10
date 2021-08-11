class projectStorageItem {
  constructor(name) {
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
      return JSON.parse(localStorage.getItem(this.name));
    } catch {
      return {};
    }
  }
  clear() {
    localStorage.removeItem(this.name);
    this.callListeners();
  }

  setListener(name, func) {
    if (func) this.listeners[name] = func;
    else this.clearListener(name);
  }
  clearListener(name) {
    try {
      delete this.listeners[name];
    } catch {}
  }
  callListeners() {
    Object.values(this.listeners).forEach((func) => {
      func(this);
    });
  }
}

const projectStorage = {
  user_token: new projectStorageItem('user_token'),
  user_info: new projectStorageItem('user_info'),
  favorite_playlist: new projectStorageItem('favorite_playlist'),
};

function fillUserInfo() {
  const ps = projectStorage;
  if (ps.user_token.exists() && !ps.user_info.exists()) {
    mainServer.user.one(ps.user_token.get().id).then((res) => {
      ps.user_info.set(res.data);
      console.log(res);
    });
  }
}

function localLogin(data) {
  const ps = projectStorage;
  ps.user_token.clear();
  ps.user_info.clear();
  ps.user_token.set(data);
  fillUserInfo();
}

const favorite_playlist_name = '__favorites__';

function fillFavPlaylist() {
  const ps = projectStorage;
  const token = ps.user_token.get().token;
  mainServer.playlist
    .all(token)
    .then((res) => {
      const list = res.data.filter((item) => item.name == favorite_playlist_name);
      if (list.length == 0) {
        mainServer.playlist.create(token, favorite_playlist_name).then((resp) => {
          ps.favorite_playlist.set(resp.data);
        });
      } else {
        ps.favorite_playlist.set({id: list[0].id});
        console.log(list[0].name);
      }
    })
    .catch(() => {});
}

fillUserInfo();
