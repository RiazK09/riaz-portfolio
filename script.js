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

const heroSection = document.querySelector('#home');
if (heroSection) {
  const syncHeroHeader = () => {
    document.body.classList.toggle('hero-active', window.scrollY < Math.max(120, heroSection.offsetHeight * 0.72));
  };
  syncHeroHeader();
  window.addEventListener('scroll', syncHeroHeader, { passive: true });
}

const heroPerson = document.querySelector('.hero-person');
heroPerson?.addEventListener('error', () => {
  const fallback = heroPerson.dataset.fallback;
  if (fallback && !heroPerson.dataset.fallbackUsed) {
    heroPerson.dataset.fallbackUsed = 'true';
    heroPerson.src = fallback;
  }
});


const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let ringX = x, ringY = y;

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
  }, { passive:true });

  window.addEventListener('pointerleave', () => document.body.classList.remove('cursor-ready'));
  document.querySelectorAll('a,button,[role="button"]').forEach((element) => {
    element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
  });
}


const signatureAssets = [
  'assets/signature-my.png',
  'assets/signature-hello-world.png'
];

Promise.all(signatureAssets.map((src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = resolve;
  img.onerror = reject;
  img.src = src;
}))).then(() => {
  document.body.classList.add('signature-assets-ready');
}).catch(() => {
  // Keep the existing script-font fallback until both exact Canva assets are present.
});


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
