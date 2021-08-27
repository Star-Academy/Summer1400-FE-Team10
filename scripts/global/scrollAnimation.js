const animReqs = document.getElementsByClassName('anim-req');

function refreshAnim() {
  const st = document.documentElement.scrollTop;
  const h = window.innerHeight;
  const sh = document.documentElement.scrollHeight;

  const dis = sh - h - st;
  const gap = 150;
  const rat = (gap - dis) / gap;

  const p = 0.8;

  let cur = rat < 0 ? st + h * p : st + h * p + rat * h * (1 - p);
  cur = Math.max(cur, h);

  const animOff = st + h + 10;

  const animstart = 'anim-start';

  for (const e of animReqs)
    if (!e.classList.contains(animstart) && e.offsetTop < cur) {
      e.classList.add(animstart);
    } else if (e.classList.contains(animstart) && e.offsetTop > animOff) {
      e.classList.remove(animstart);
    }
}

document.addEventListener('scroll', refreshAnim);

refreshAnim();
