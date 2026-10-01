const progress = document.getElementById('progress-bar');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

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

document.querySelectorAll('[data-asset]').forEach((element) => {
  const src = assetMap[element.dataset.asset];
  if (!src) return;

  const probe = new Image();
  probe.onload = () => {
    element.style.backgroundImage = `url("${src}")`;
    element.classList.add('has-image');
  };
  probe.src = src;
});

document.querySelectorAll('[data-video]').forEach((element) => {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', 'Website project preview');
  video.src = `assets/${element.dataset.video}`;

  video.addEventListener('canplay', () => {
    element.appendChild(video);
    element.classList.add('has-video');
    video.play().catch(() => {});
  }, { once: true });

  video.addEventListener('error', () => video.remove(), { once: true });
});

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let ringX = x;
  let ringY = y;

  const animateCursor = () => {
    ringX += (x - ringX) * 0.16;
    ringY += (y - ringY) * 0.16;
    cursorDot.style.transform = `translate3d(${x}px,${y}px,0)`;
    cursorRing.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  window.addEventListener('pointermove', (event) => {
    x = event.clientX;
    y = event.clientY;
    document.body.classList.add('cursor-ready');
  }, { passive: true });

  window.addEventListener('pointerleave', () => document.body.classList.remove('cursor-ready'));

  document.querySelectorAll('a,button,[role="button"]').forEach((element) => {
    element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
  });
}

const heroScroll = document.querySelector('.hero-scroll');
const scrollArrows = [...document.querySelectorAll('.scroll-arrows i')];
if (heroScroll && scrollArrows.length) {
  let arrowIndex = 0;

  setInterval(() => {
    scrollArrows.forEach((arrow, index) => {
      arrow.classList.toggle('is-active', index === arrowIndex);
    });
    arrowIndex = (arrowIndex + 1) % scrollArrows.length;
  }, 320);

  heroScroll.addEventListener('click', (event) => {
    const target = document.querySelector('#contents');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* Load only the critical hero fonts instead of waiting for every font on the page. */
(() => {
  const root = document.documentElement;

  if (!document.fonts?.load) {
    root.classList.remove('fonts-loading', 'signature-font-loading');
    return;
  }

  Promise.all([
    document.fonts.load('500 180px "Bricolage Grotesque"'),
    document.fonts.load('400 18px "Inter"')
  ]).finally(() => {
    root.classList.remove('fonts-loading');
  });

  document.fonts.load('400 160px "Revive 80 Signature"').then(() => {
    root.classList.remove('signature-font-loading');
  }).catch(() => {
    /* Keep Signature accents hidden rather than showing a wrong fallback face. */
  });

  setTimeout(() => root.classList.remove('fonts-loading'), 1600);
})();
