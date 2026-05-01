// ===== PARALLAX & SCROLL ANIMATIONS =====

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ANIM_MS = 720; // must match CSS transition duration

// ---- Intersection Observer ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('revealed');
    revealObserver.unobserve(el);

    // Remove anim class after it finishes so card hover transitions snap back to normal
    const delay = parseFloat(el.style.transitionDelay || 0) * 1000;
    setTimeout(() => {
      el.classList.remove('anim-up', 'anim-left', 'anim-right');
      el.style.transitionDelay = '';
      el.style.willChange = 'auto';
    }, delay + ANIM_MS + 60);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

// ---- Helpers ----
function register(el, cls, delayMs = 0) {
  if (!el || reducedMotion) return;
  el.classList.add(cls);
  if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
  revealObserver.observe(el);
}

function registerAll(selector, cls, stagger = false) {
  document.querySelectorAll(selector).forEach((el, i) => {
    const delay = stagger ? (i % 3) * 80 : 0;
    register(el, cls, delay);
  });
}

// ---- Register elements ----
if (!reducedMotion) {
  // Section headers
  registerAll('.section-header', 'anim-up');

  // Card grids — staggered fade up
  registerAll('.service-card',   'anim-up', true);
  registerAll('.portfolio-card', 'anim-up', true);
  registerAll('.team-card',      'anim-up', true);
  registerAll('.pricing-card',   'anim-up', true);
  registerAll('.value-card',     'anim-up', true);
  registerAll('.faq-item',       'anim-up', true);
  registerAll('.contact-item',   'anim-up', true);

  // Testimonials
  register(document.querySelector('.testimonial-slider'), 'anim-up');

  // About — slide in from opposite sides
  register(document.querySelector('.about-image-wrap'), 'anim-left');
  register(document.querySelector('.about-content'),    'anim-right', 140);

  // Contact — slide in from opposite sides
  register(document.querySelector('.contact-info'),      'anim-left');
  register(document.querySelector('.contact-form-wrap'), 'anim-right', 140);

  // Footer
  register(document.querySelector('.footer-brand'), 'anim-up');
  registerAll('.footer-col', 'anim-up', true);
}

// Hero background parallax is handled by js/parallax.js
