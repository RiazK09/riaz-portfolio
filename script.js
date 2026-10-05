const progress = document.getElementById('progress-bar');

const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

/* Dynamic copyright year */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Floating navigation */
const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.getElementById('site-menu');
const menuClose = document.querySelector('.menu-close');
const menuBackdrop = document.querySelector('[data-menu-close]');
const menuLinks = [...document.querySelectorAll('.site-menu-links a')];
let menuPreviouslyFocused = null;

const menuFocusable = () =>
  [...siteMenu.querySelectorAll('a[href],button:not([disabled])')]
    .filter((element) => element.offsetParent !== null);

const openMenu = () => {
  if (!siteMenu || !menuToggle) return;
  menuPreviouslyFocused = document.activeElement;
  siteMenu.classList.add('is-open');
  siteMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close portfolio navigation');
  document.body.classList.add('menu-open');
  requestAnimationFrame(() => menuClose?.focus());
};

const closeMenu = ({ restoreFocus = true } = {}) => {
  if (!siteMenu || !menuToggle) return;
  siteMenu.classList.remove('is-open');
  siteMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open portfolio navigation');
  document.body.classList.remove('menu-open');
  if (restoreFocus && menuPreviouslyFocused instanceof HTMLElement) {
    menuPreviouslyFocused.focus();
  }
};

menuToggle?.addEventListener('click', () => {
  if (siteMenu?.classList.contains('is-open')) closeMenu();
  else openMenu();
});
menuClose?.addEventListener('click', () => closeMenu());
menuBackdrop?.addEventListener('click', () => closeMenu());

menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    if (!target) return;

    event.preventDefault();
    closeMenu({ restoreFocus: false });
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
    history.replaceState(null, '', href);
  });
});

document.addEventListener('keydown', (event) => {
  if (!siteMenu?.classList.contains('is-open')) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = menuFocusable();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* Keep the floating nav aware of the section currently in view.
   All five project pages intentionally map back to Web Design Projects. */
const navTargetMap = {
  home: 'home',
  contents: 'home',
  about: 'about',
  skills: 'skills',
  work: 'work',
  education: 'education',
  projects: 'projects',
  'project-1': 'projects',
  'project-2': 'projects',
  'project-3': 'projects',
  'project-4': 'projects',
  'project-5': 'projects',
  why: 'why',
  testimonials: 'testimonials',
  contact: 'contact'
};

const setActiveNav = (sectionId) => {
  const navTarget = navTargetMap[sectionId];
  if (!navTarget) return;

  menuLinks.forEach((link) => {
    const active = link.dataset.navTarget === navTarget;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

const sections = [...document.querySelectorAll('main > section[id]')];
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible[0]) setActiveNav(visible[0].target.id);
  }, {
    rootMargin: '-28% 0px -56% 0px',
    threshold: [0, .15, .35, .6]
  });

  sections.forEach((section) => sectionObserver.observe(section));
} else if (sections[0]) {
  setActiveNav(sections[0].id);
}

/* Lazy background images */
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

/* Project videos mount only when near the viewport and pause off-screen. */
const videoTargets = [...document.querySelectorAll('[data-video]')];

const mountVideo = (element) => {
  if (element.dataset.videoMounted === 'true') return element._projectVideo || null;

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

/* Custom desktop pointer */
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

/* Hero scroll cue */
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

/* Avoid flashes while the two key font families resolve. */
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
