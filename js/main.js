/* ============================================
   EVIMIZ INTERNATIONAL — var5 "Editorial Tech"
   Navigation + Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
  initPartnersMarquee();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Sticky / Transparent → White Navigation ---------- */
function initStickyNav() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('home');
  if (!nav || !hero || !('IntersectionObserver' in window)) return;

  // Nav turns white once the hero is (almost) out of view
  new IntersectionObserver(([entry]) => {
    nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
  }, { rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }).observe(hero);
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');
  if (!hamburger || !menu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;opacity:0;visibility:hidden;transition:opacity 0.3s ease,visibility 0.3s';
  document.body.appendChild(overlay);

  function toggle() {
    const isOpen = menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    overlay.style.opacity = isOpen ? '1' : '0';
    overlay.style.visibility = isOpen ? 'visible' : 'hidden';
  }

  function close() {
    menu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('nav-open');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
  }

  hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', close);

  // Close menu when clicking nav links
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ---------- Scroll Animations (IntersectionObserver) ---------- */
const STAGGER_MS = 60;

function initScrollAnimations() {
  const animEls = document.querySelectorAll('.anim');
  if (!animEls.length) return;

  if (!('IntersectionObserver' in window)) {
    animEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Siblings in the same grid enter one after another
  animEls.forEach(el => {
    const group = [...el.parentElement.children].filter(c => c.classList.contains('anim'));
    el.style.transitionDelay = `${group.indexOf(el) * STAGGER_MS}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      // Drop the delay after the entrance so hover transitions react instantly
      el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
      observer.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animEls.forEach(el => observer.observe(el));
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById('nav');
      const offset = nav ? nav.offsetHeight : 0;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: target.offsetTop - offset, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
}

/* ---------- Partners Marquee ---------- */
const MARQUEE_SPEED = 40; // px per second

function initPartnersMarquee() {
  const list = document.getElementById('partnersLogos');
  if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const originals = [...list.children];
  const cloneSet = () => originals.forEach(el => {
    const copy = el.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    list.appendChild(copy);
  });

  // One half must be wider than the widest screen, otherwise a gap shows mid-loop
  list.classList.add('is-marquee');
  const target = Math.max(window.screen.width, window.innerWidth);
  while (list.scrollWidth < target) cloneSet();

  // Second identical half: the track scrolls by -50% and snaps back unnoticed
  [...list.children].forEach(el => {
    const copy = el.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    list.appendChild(copy);
  });

  list.style.setProperty('--marquee-duration', `${list.scrollWidth / 2 / MARQUEE_SPEED}s`);

  // Glide to a stop on hover instead of freezing mid-frame
  const [anim] = list.getAnimations();
  if (!anim) return;
  let frame;
  const glideTo = (target) => {
    cancelAnimationFrame(frame);
    const from = anim.playbackRate;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 500, 1);
      anim.playbackRate = from + (target - from) * (1 - (1 - t) ** 3); // ease-out cubic
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };
  const marquee = list.parentElement;
  marquee.addEventListener('mouseenter', () => glideTo(0));
  marquee.addEventListener('mouseleave', () => glideTo(1));
}
