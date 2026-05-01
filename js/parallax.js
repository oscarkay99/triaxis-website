// ===== WORLD-CLASS PARALLAX ENGINE =====

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  const LERP_SCROLL = 0.09;
  const LERP_MOUSE  = 0.075;

  // ---- State ----
  let lerpY   = window.scrollY;
  let rawY    = window.scrollY;
  let mouseX  = 0, mouseY  = 0;
  let tMouseX = 0, tMouseY = 0;

  window.addEventListener('scroll', () => { rawY = window.scrollY; }, { passive: true });

  document.addEventListener('mousemove', e => {
    if (window.innerWidth <= 768) return;
    tMouseX = e.clientX - window.innerWidth  / 2;
    tMouseY = e.clientY - window.innerHeight / 2;
  });
  document.addEventListener('mouseleave', () => { tMouseX = 0; tMouseY = 0; });

  // ---- Hero layers — scroll depth + mouse depth ----
  const heroLayers = [
    { sel: '.hero-orbs',       scrollD:  0.28, mouseD: 0.030 },
    { sel: '.hero-badge',      scrollD:  0.13, mouseD: 0.018 },
    { sel: '.hero-content h1', scrollD:  0.09, mouseD: 0.010 },
    { sel: '.hero-content p',  scrollD:  0.055, mouseD: 0.006 },
    { sel: '.hero-buttons',    scrollD:  0.03,  mouseD: 0.003 },
    { sel: '.hero-stats',      scrollD: -0.04,  mouseD: 0     },
  ].map(l => ({ ...l, el: document.querySelector(l.sel) })).filter(l => l.el);

  const heroBg = document.querySelector('.hero');

  // ---- Card image parallax ----
  const cardImageData = [
    ...document.querySelectorAll('.service-img-wrap img'),
    ...document.querySelectorAll('.portfolio-img-wrap img'),
  ].map(img => ({ img, wrap: img.parentElement }));

  // ---- About image parallax ----
  const aboutImg = document.querySelector('.about-img');

  // ---- RAF loop ----
  const tick = () => {
    lerpY  += (rawY    - lerpY)  * LERP_SCROLL;
    mouseX += (tMouseX - mouseX) * LERP_MOUSE;
    mouseY += (tMouseY - mouseY) * LERP_MOUSE;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw > 768) {
      // Background image slow drift
      if (heroBg && lerpY < vh * 1.6) {
        heroBg.style.backgroundPositionY = `calc(50% + ${lerpY * 0.38}px)`;
      }

      // Layered hero element parallax
      heroLayers.forEach(({ el, scrollD, mouseD }) => {
        const sy = lerpY  * scrollD;
        const mx = mouseX * mouseD;
        const my = mouseY * mouseD;
        el.style.transform = `translate3d(${mx}px, ${my + sy}px, 0)`;
      });

      // Card images — move slower than their container for depth illusion
      cardImageData.forEach(({ img, wrap }) => {
        const rect = wrap.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${progress * 30}px) scale(1.14)`;
      });

      // About image separate parallax
      if (aboutImg) {
        const r = aboutImg.getBoundingClientRect();
        if (r.bottom > -100 && r.top < vh + 100) {
          const progress = (r.top + r.height / 2 - vh / 2) / vh;
          aboutImg.style.transform = `translateY(${progress * 20}px) scale(1.04)`;
        }
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  // ---- Magnetic buttons ----
  document.querySelectorAll('.btn').forEach(btn => {
    // Exclude full-width form/plan buttons
    if (btn.classList.contains('btn-full')) return;
    if (btn.closest('.plan-features')) return;

    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 580);
    });
  });

  // ---- Section depth lines (decorative orbs in testimonials) ----
  const testimonialsOrbs = document.querySelector('.hero-orbs');
  // orbs already handled via hero layers above
}
