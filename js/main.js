/* ============================================
   EVIMIZ INTERNATIONAL — var4
   Exact copy of evimiz.kz, English version
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileNav();
  initMobileDropdowns();
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
    // Close all dropdowns too
    document.querySelectorAll('.nav__dropdown.active').forEach(d => d.classList.remove('active'));
  }

  hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', close);
  // Close menu when clicking a non-dropdown nav link
  menu.querySelectorAll('.nav__link:not(.nav__link--has-dropdown)').forEach(link => {
    link.addEventListener('click', close);
  });
  // Close menu when clicking a dropdown sub-link
  menu.querySelectorAll('.nav__dropdown-link').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ---------- Mobile Dropdowns ---------- */
function initMobileDropdowns() {
  const dropdowns = document.querySelectorAll('.nav__dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav__link--has-dropdown');
    if (!trigger) return;

    trigger.addEventListener('click', function(e) {
      // Only handle as dropdown toggle on mobile (when hamburger is visible)
      const hamburger = document.getElementById('navHamburger');
      if (window.getComputedStyle(hamburger).display === 'none') return;

      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dropdown) other.classList.remove('active');
      });

      // Toggle this dropdown
      dropdown.classList.toggle('active');
    });
  });
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
