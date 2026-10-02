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
  'about-portrait.jpg': 'assets/about-portrait.jpg',
  'workspace.jpg': 'assets/workspace.jpg',
  'project-cloud-faction.jpg': 'assets/project-cloud-faction.jpg',
  'project-little-lanterns.jpg': 'assets/project-little-lanterns.jpg',
  'project-the-ghetto.jpg': 'assets/project-the-ghetto.jpg',
  'project-wedding.jpg': 'assets/project-wedding.jpg',
  'project-zaakirah.jpg': 'assets/project-zaakirah.jpg',
  'why-portrait.jpg': 'assets/why-portrait.jpg'
};

const loadBackground = (element) => {
  if (element.dataset.assetLoaded === 'true') return;
  const src = assetMap[element.dataset.asset];
  if (!src) return;

  const probe = new Image();
  probe.decoding = 'async';
  probe.onload = () => {
    element.style.backgroundImage = `url("${src}")`;
    element.classList.add('has-image');
    element.dataset.assetLoaded = 'true';
  };
  probe.src = src;
};

const backgroundTargets = [...document.querySelectorAll('[data-asset]')];
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadBackground(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '700px 0px' });

  backgroundTargets.forEach((element) => imageObserver.observe(element));
} else {
  backgroundTargets.forEach(loadBackground);
}

const videoTargets = [...document.querySelectorAll('[data-video]')];
const mountVideo = (element) => {
  if (element.dataset.videoMounted === 'true') return null;

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', 'Website project preview');
  video.src = `assets/${element.dataset.video}`;

  video.addEventListener('loadeddata', () => {
    if (!video.isConnected) element.appendChild(video);
    element.classList.add('has-video');
  }, { once: true });

  video.addEventListener('error', () => {
    video.remove();
    element.classList.remove('has-video');
  }, { once: true });

  element.dataset.videoMounted = 'true';
  element._projectVideo = video;
  return video;
};

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      let video = element._projectVideo;

      if (entry.isIntersecting) {
        video = video || mountVideo(element);
        if (video) video.play().catch(() => {});
      } else if (video) {
        video.pause();
      }
    });
  }, { rootMargin: '220px 0px', threshold: 0.08 });

  videoTargets.forEach((element) => videoObserver.observe(element));
} else {
  videoTargets.forEach((element) => {
    const video = mountVideo(element);
    if (video) video.play().catch(() => {});
  });
}

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
  const arrowTimer = window.setInterval(() => {
    scrollArrows.forEach((arrow, index) => {
      arrow.classList.toggle('is-active', index === arrowIndex);
    });
    arrowIndex = (arrowIndex + 1) % scrollArrows.length;
  }, 320);

  heroScroll.addEventListener('click', (event) => {
    const target = document.querySelector('#contents');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  window.addEventListener('pagehide', () => clearInterval(arrowTimer), { once: true });
}

(() => {
  const root = document.documentElement;

  if (!document.fonts?.load) {
    root.classList.remove('fonts-loading', 'signature-font-loading');
    return;
  }

  Promise.all([
    document.fonts.load('500 180px "Bricolage Grotesque"'),
    document.fonts.load('400 18px "Inter"')
  ]).finally(() => root.classList.remove('fonts-loading'));

  document.fonts.load('400 160px "Revive 80 Signature"')
    .then(() => root.classList.remove('signature-font-loading'))
    .catch(() => {});

  setTimeout(() => root.classList.remove('fonts-loading'), 1600);
})();
