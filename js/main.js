/* ============================================
   EVIMIZ INTERNATIONAL — v2 PREMIUM JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
});

/* ---------- Sticky Navigation ---------- */
function initStickyNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');

  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;opacity:0;visibility:hidden;transition:all 0.4s ease';
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
  menu.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', close));
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('animate--visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
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
      const offset = document.getElementById('nav').offsetHeight;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}
