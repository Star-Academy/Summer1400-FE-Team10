function templateLoader(address) {
  return fetch(address)
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      console.log(`Error while loading template file '${address}'`);
    });
}

function templateInstancer(template = '', data) {
  let res = template;
  for (const o in data) res = res.replace(new RegExp('{{' + o + '}}', 'g'), data[o]);
  const elem = document.createElement('div');
  elem.innerHTML = res;
  return elem.children[0];
}
