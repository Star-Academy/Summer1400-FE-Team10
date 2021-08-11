const urlSearchParams = new URLSearchParams(window.location.search);
const queryParams = Object.fromEntries(urlSearchParams.entries());

const sondId = parseInt(queryParams.id);

const songinfo = document.querySelector('#song-info');
songinfo.style.display = 'none';

mainServer.song.one(sondId).then((res) => {
  const data = res.data.song;

  const lyrics = data.lyrics.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
  console.log(data);
  document.querySelector('#song-name').innerHTML = data.name;
  document.querySelector('#song-artist').innerHTML = data.artist;
  document.querySelector('#song-cover').src = data.cover;
  document.querySelector('#song-banner').style.setProperty('--bg-image', `url('${data.cover}')`);
  document.querySelector('#song-publish-date').innerHTML = new Date(data.publish_date).toLocaleDateString('fa-IR');
  songinfo.style.display = null;
  document.querySelector('#song-lyrics').innerHTML = lyrics;
  document.querySelector('#song-copy-lyrics').addEventListener('click', () => {
    navigator.clipboard.writeText(data.lyrics);
  });
  var filename = data.file.substring(data.file.lastIndexOf('/') + 1);
  document.querySelector('#song-download').href = data.file;
  document.querySelector('#song-download').download = filename;
  document.querySelector('#song-download-hq').href = data.file;
  document.querySelector('#song-download-hq').download = filename;
  loadMeta(data);
});

function loadMeta(data) {
  const url = data.file;

  const p = document.querySelector('#song-banner');

  const a = document.createElement('audio');
  a.preload = 'metadata';
  a.controls = 'true';
  a.classList.add('player');
  a.src = url;
  a.addEventListener('loadedmetadata', (e) => {
    const info = e.composedPath();
    console.log(info);
    console.log(a.duration);
    document.querySelector('#song-player').appendChild(a);
  });
}
