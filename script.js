const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const progress = document.getElementById('progress-bar');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

document.getElementById('year').textContent = new Date().getFullYear();

const assetMap = {
  'hero-portrait.jpg': 'assets/hero-portrait.jpg',
  'about-portrait.jpg': 'assets/about-portrait.jpg',
  'workspace.jpg': 'assets/workspace.jpg',
  'project-cloud-faction.jpg': 'assets/project-cloud-faction.jpg',
  'project-little-lanterns.jpg': 'assets/project-little-lanterns.jpg',
  'project-the-ghetto.jpg': 'assets/project-the-ghetto.jpg',
  'project-wedding.jpg': 'assets/project-wedding.jpg',
  'project-zaakirah.jpg': 'assets/project-zaakirah.jpg',
  'why-portrait.jpg': 'assets/why-portrait.jpg'
};

document.querySelectorAll('[data-asset]').forEach(el => {
  const key = el.dataset.asset;
  const src = assetMap[key];
  if (!src) return;

  const probe = new Image();
  probe.onload = () => {
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add('has-image');
  };
  probe.src = src;
});

document.querySelectorAll('[data-video]').forEach(el => {
  const src = `assets/${el.dataset.video}`;
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', 'Website project preview');
  video.src = src;

  video.addEventListener('canplay', () => {
    el.appendChild(video);
    el.classList.add('has-video');
    video.play().catch(() => {});
  }, { once: true });

  video.addEventListener('error', () => video.remove(), { once: true });
});

const heroPerson = document.querySelector('.hero-person');
heroPerson?.addEventListener('error', () => {
  const fallback = heroPerson.dataset.fallback;
  if (fallback && !heroPerson.dataset.fallbackUsed) {
    heroPerson.dataset.fallbackUsed = 'true';
    heroPerson.src = fallback;
  }
});


const catCursor = document.querySelector('.tech-cat-cursor');
const mouseCursor = document.querySelector('.tech-mouse-cursor');
if (catCursor && mouseCursor && window.matchMedia('(pointer:fine)').matches) {
  let mx = innerWidth / 2, my = innerHeight / 2;
  let tx = mx, ty = my;
  let trailX = mx + 24, trailY = my + 15;

  const renderCursor = () => {
    trailX += (tx - trailX) * 0.16;
    trailY += (ty - trailY) * 0.16;
    catCursor.style.transform = `translate(${tx + 4}px,${ty + 4}px)`;
    mouseCursor.style.transform = `translate(${trailX + 28}px,${trailY + 18}px)`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    document.body.classList.add('cursor-ready');
  }, { passive:true });

  window.addEventListener('pointerleave', () => document.body.classList.remove('cursor-ready'));
  window.addEventListener('pointerenter', () => document.body.classList.add('cursor-ready'));

  document.querySelectorAll('a,button,[role="button"]').forEach(el => {
    el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
  });
}
