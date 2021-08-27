let song_list_items_per_page = parseInt(sessionStorage.getItem('songs-items-per-page')) || 20;
let song_list_page_num = 15;
let song_list_current_page = parseInt(sessionStorage.getItem('songs-current-page')) || 1;
let song_list_max_search_num = 50;

function clearSongList(root) {
  while (root.childElementCount > 1) root.removeChild(root.children[1]);
}

const loadingElem = document.querySelector('.song-list-loading');
let loadingElemTimeout = null;

const favorites = {
  listeners: [],
  list: [],
  loaded: false,
};
const favoritesPromise = mainServer.playlist.one(projectStorage.favorite_playlist.get().id).then((res) => {
  favorites.list = res.data.songs.map((x) => x.id);
  favorites.loaded = true;
  favorites.listeners.forEach((l) => l(favorites.list));
  console.log('heh', favorites.listeners);
  //find((item) => item.id == songData.id)) heartIcon.classList.add(act);
});

function renderSongList(root, template, data) {
  clearSongList(root);
  favorites.listeners = [];
  root.children[0].style.display = 'initial';

  for (const songData of data) {
    const songElem = templateInstancer(template, songData);

    /** img placeholder **/
    const main_img = songElem.querySelector('img.music-cover');
    const placeholder_img = songElem.querySelector('img.music-cover-placeholder');
    main_img.addEventListener('load', () => {
      main_img.classList.remove('music-cover--hidden');
      placeholder_img.classList.add('music-cover-placeholder--hidden');
      setTimeout(() => {
        placeholder_img.style.display = 'none';
      }, 320);
    });

    const heartIcon = songElem.querySelector('#heart-icon');
    const playIcon = songElem.querySelector('#play-icon');

    const dis = 'disabled';
    const act = 'active';

    heartIcon.addEventListener('click', () => {
      const ps = projectStorage;
      if (heartIcon.classList.contains(dis)) return;
      heartIcon.classList.add(dis);

      if (!heartIcon.classList.contains(act)) {
        mainServer.playlist.addSong(ps.user_token.get().token, ps.favorite_playlist.get().id, songData.id).then(() => {
          heartIcon.classList.remove(dis);
          heartIcon.classList.add(act);
          if (favorites.list.find((i) => i == songData.id) == undefined) favorites.list.push(songData.id);
        });
      } else {
        mainServer.playlist
          .removeSong(ps.user_token.get().token, ps.favorite_playlist.get().id, songData.id)
          .then(() => {
            heartIcon.classList.remove(dis);
            heartIcon.classList.remove(act);
            if (favorites.list.find((i) => i == songData.id) != undefined)
              favorites.list = favorites.list.filter((i) => i != songData.id);
          });
      }
    });

    const update = (list) => {
      if (list.find((id) => id == songData.id)) heartIcon.classList.add(act);
      if (heartIcon.classList.contains(dis)) heartIcon.classList.remove(dis);
    };

    console.log(favorites.loaded);

    if (favorites.loaded) {
      update(favorites.list);
    } else {
      heartIcon.classList.add(dis);
      favorites.listeners.push(update);
    }

    root.appendChild(songElem);
    console.log(songData.file);
  }
}

let templateNode = document.querySelector('#songs-list-item-template');
let template = templateNode.content.children[0].outerHTML;

const root = templateNode.parentElement;

function loadSongPage(page_num) {
  loadingElem.classList.remove('song-list-loading--hidden');
  if (root.children.length > 2) loadingElem.classList.add('song-list-loading--small');

  if (loadingElemTimeout) clearTimeout(loadingElemTimeout);
  loadingElem.style.display = null;

  const data = mainServer.song.page(song_list_items_per_page, page_num);

  Promise.all([root, template, data]).then(([root, template, data]) => {
    renderSongList(root, template, data.data.songs);

    loadingElem.classList.add('song-list-loading--hidden');
    loadingElemTimeout = setTimeout(() => {
      loadingElem.classList.remove('song-list-loading--small');
      loadingElem.style.display = 'none';
      loadingElemTimeout = null;
    }, 220);
  });
}

function loadSongSearch(phrase) {
  clearSongList(root);
  loadingElem.classList.remove('song-list-loading--hidden');
  loadingElem.classList.remove('song-list-loading--small');

  if (loadingElemTimeout) clearTimeout(loadingElemTimeout);
  loadingElem.style.display = 'flex';

  const data = mainServer.song.find(phrase, song_list_max_search_num);

  Promise.all([root, template, data]).then(([root, template, data]) => {
    renderSongList(root, template, data.data.songs);

    loadingElem.classList.add('song-list-loading--hidden');
    loadingElemTimeout = setTimeout(() => {
      loadingElem.style.display = 'none';
      loadingElemTimeout = null;
    }, 220);
  });
}

function setSongPage(page_num, all_page_num) {
  const pagination = document.querySelector('.pagination');
  const pagination_nums = pagination.querySelector('#pagination__numbers');
  const right_arrow = pagination.querySelector('.pagination__right-arrow');
  const left_arrow = pagination.querySelector('.pagination__left-arrow');

  const paginationOptions = document.querySelector('.pagination-options');
  const songsPerPageInput = paginationOptions.querySelector('#song-items-per-page');
  const songsPageNumInput = paginationOptions.querySelector('#song-page-num-input');

  sessionStorage.setItem('songs-current-page', page_num.toString());

  loadSongPage(page_num);

  song_list_current_page = page_num;
  items = pagination_nums.children;
  for (const item of items) item.style.display = 'initial';
  left_arrow.classList.remove('disabled');
  right_arrow.classList.remove('disabled');

  if (page_num < 5) items[2].style.display = 'none';
  if (page_num < 4) items[3].style.display = 'none';
  if (page_num < 3) items[1].style.display = 'none';
  if (page_num < 2) items[0].style.display = 'none';

  items[0].innerHTML = '1';
  items[1].innerHTML = '2';

  items[3].innerHTML = (page_num - 1).toString();
  items[4].innerHTML = page_num.toString();
  items[5].innerHTML = (page_num + 1).toString();

  items[7].innerHTML = (all_page_num - 1).toString();
  items[8].innerHTML = all_page_num.toString();

  if (page_num > all_page_num - 4) items[6].style.display = 'none';
  if (page_num > all_page_num - 3) items[5].style.display = 'none';
  if (page_num > all_page_num - 2) items[7].style.display = 'none';
  if (page_num > all_page_num - 1) items[8].style.display = 'none';

  if (page_num == all_page_num) left_arrow.classList.add('disabled');
  if (page_num == 1) right_arrow.classList.add('disabled');

  songsPageNumInput.value = page_num;
}

//////////////////////////////////////////

function paginationInit() {
  const pagination = document.querySelector('.pagination');
  const pagination_nums = pagination.querySelector('#pagination__numbers');
  const right_arrow = pagination.querySelector('.pagination__right-arrow');
  const left_arrow = pagination.querySelector('.pagination__left-arrow');

  for (const item of pagination_nums.children)
    if (!item.classList.contains('noninteractable')) {
      item.addEventListener('click', () => setSongPage(parseInt(item.innerHTML), song_list_page_num));
    }
  right_arrow.addEventListener('click', (e) => {
    if (!right_arrow.classList.contains('disabled')) setSongPage(song_list_current_page - 1, song_list_page_num);
  });
  left_arrow.addEventListener('click', () => {
    if (!left_arrow.classList.contains('disabled')) setSongPage(song_list_current_page + 1, song_list_page_num);
  });

  const paginationOptions = document.querySelector('.pagination-options');
  const songsPerPageInput = paginationOptions.querySelector('#song-items-per-page');
  const songsPageNumInput = paginationOptions.querySelector('#song-page-num-input');

  songsPerPageInput.value = song_list_items_per_page;
  songsPerPageInput.addEventListener('change', (e) => {
    const tmp = parseInt(e.target.value);
    song_list_items_per_page = tmp;
    sessionStorage.setItem('songs-items-per-page', tmp.toString());
    console.log(tmp);
    setSongPage(song_list_current_page, song_list_page_num);
  });
  songsPageNumInput.setAttribute('max', song_list_page_num.toString());
  songsPageNumInput.value = 1;
  songsPageNumInput.addEventListener('change', (e) => {
    let tmp = parseInt(e.target.value);
    if (tmp < 1) tmp = 1;
    if (tmp > song_list_page_num) tmp = song_list_page_num;
    setSongPage(tmp, song_list_page_num);
  });

  setSongPage(song_list_current_page, song_list_page_num);
}

paginationInit();
