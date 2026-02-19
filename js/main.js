/* ============================================
   EVIMIZ INTERNATIONAL — var5 "Editorial Tech"
   Navigation + Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
});

/* ---------- Sticky / Transparent → White Navigation ---------- */
function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });

  // Set initial state
  nav.classList.toggle('nav--scrolled', window.scrollY > 50);
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');
  if (!hamburger || !menu) return;

  // Create overlay
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

  // Close menu when clicking nav links
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ---------- Scroll Animations (IntersectionObserver) ---------- */
function initScrollAnimations() {
  const animEls = document.querySelectorAll('.anim');
  if (!animEls.length) return;

  // If IntersectionObserver not supported, show all immediately
  if (!('IntersectionObserver' in window)) {
    animEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay, 10) || 0;

        if (delay > 0) {
          setTimeout(() => el.classList.add('is-visible'), delay);
        } else {
          el.classList.add('is-visible');
        }

        observer.unobserve(el);
      }
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
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}
