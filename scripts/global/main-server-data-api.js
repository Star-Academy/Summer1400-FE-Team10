const mainHost = 'http://130.185.120.192:5000';

const fetchSetting = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //mode: 'no-cors', // no-cors, *cors, same-origin
  //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  //redirect: 'follow', // manual, *follow, error
  //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify({}), // body data type must match "Content-Type" header
};

const fetchSettings = {
  get: () => ({
    ...fetchSetting,
    method: 'GET',
    body: null,
  }),

  post: (body = {}, removeNulls = false) => ({
    ...fetchSetting,
    method: 'POST',
    body: JSON.stringify((removeNulls && Object.keys(body).forEach((k) => !body[k] && delete body[k])) || body),
  }),
};

function fetchData(url, settings) {
  return fetch(mainHost + url, settings)
    .then((res) => {
      return Promise.all([res, res.json()]);
    })
    .then(([res, data]) => ({...data, statusCode: res.status}));
}

const mainServer = {
  user: {
    one: (id) => fetchData(`/user/one/${id}`, fetchSettings.get()),
    auth: (token) =>
      fetchData(
        `/user/auth`,
        fetchSettings.post({
          token,
        })
      ),
    register: (username, email, password, firstName, lastName) =>
      fetchData(
        `/user/register`,
        fetchSettings.post({
          username,
          email,
          password,
          firstName,
          lastName,
        })
      ),
    login: (username, email, password) =>
      fetchData(
        `/user/login`,
        fetchSettings.post({
          username,
          email,
          password,
        })
      ),
    alter: (token, username, email, password, firstName, lastName, avatar, gender, birthDate) =>
      fetchData(
        `/user/alter`,
        fetchSettings.post(
          {
            token,
            username,
            email,
            password,
            firstName,
            lastName,
            avatar,
            gender,
            birthDate,
          },
          true
        )
      ),
  },
  song: {
    all: () => fetchData(`/song/all`, fetchSettings.get()),
    one: (id) => fetchData(`/song/one/${id}`, fetchSettings.get()),
    page: (size, current) =>
      fetchData(
        `/song/page`,
        fetchSettings.post({
          size,
          current,
          sorter: 'name',
          desc: false,
        })
      ),
    find: (phrase, count) =>
      fetchData(
        `/song/find`,
        fetchSettings.post({
          phrase,
          count,
          sorter: 'name',
          desc: false,
        })
      ),
  },
  playlist: {
    one: (id) => fetchData(`/playlist/one/${id}`, fetchSettings.get()),
    all: (token) =>
      fetchData(
        `/playlist/all`,
        fetchSettings.post({
          token,
        })
      ),
    create: (token, name) =>
      fetchData(
        `/playlist/create`,
        fetchSettings.post({
          token,
          name,
        })
      ),
    remove: (token, id) =>
      fetchData(
        `/playlist/remove`,
        fetchSettings.post({
          token,
          id,
        })
      ),
    addSong: (token, playlistId, songId) =>
      fetchData(
        `/playlist/add-song`,
        fetchSettings.post({
          token,
          playlistId,
          songId,
        })
      ),
    removeSong: (token, playlistId, songId) =>
      fetchData(
        `/playlist/remove-song`,
        fetchSettings.post({
          token,
          playlistId,
          songId,
        })
      ),
  },
};

//console.log(fetchSettings.post({hello: '123', num: 12, nn: null}, true));
