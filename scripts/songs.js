let status = 'loading';

function clearSongList(root) {
  while (root.childElementCount > 1) root.removeChild(root.children[1]);
  //document.querySelector('');
}

function renderSongList(root, template, data) {
  clearSongList(root);
  for (const songData of data) {
    const songElem = templateInstancer(template, songData);

    /** img placeholder **/
    const main_img = songElem.querySelector('img.music-cover');
    const placeholder_img = songElem.querySelector('img.music-cover-placeholder');
    main_img.addEventListener('load', () => {
      main_img.classList.remove('music-cover--hidden');
      placeholder_img.classList.add('music-cover-placeholder--hidden');
    });

    root.appendChild(songElem);
  }
}

let templateNode = document.querySelector('#songs-list-item-template');
let template = templateNode.content.children[0].outerHTML;
let data = mainServer.song.page(60, 1);

const root = templateNode.parentElement;

Promise.all([root, template, data]).then(([root, template, data]) => {
  console.log(data);
  renderSongList(root, template, data.songs);
});
