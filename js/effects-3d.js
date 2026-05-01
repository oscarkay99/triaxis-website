// ===== 3D EFFECTS =====

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---- Card 3D tilt + layered depth ----
  const TILT_MAX = 14;
  const PERSP    = 700;
  const LIFT     = 18;

  // Each layer pops forward a different amount, creating real depth
  const DEPTH_LAYERS = [
    { sel: '.service-img-wrap, .portfolio-img-wrap', z: 52 },
    { sel: '.service-icon',                          z: 34 },
    { sel: 'h3, h4',                                 z: 22 },
    { sel: '.team-role, .plan-name',                 z: 18 },
    { sel: 'p',                                      z: 12 },
    { sel: '.service-tags, .plan-price, .features',  z:  7 },
  ];

  const ENTER_T = 'transform 0.12s ease';
  const LEAVE_T = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';

  document.querySelectorAll('.service-card, .portfolio-card, .team-card, .pricing-card')
    .forEach(card => {
      const gloss = document.createElement('div');
      gloss.className = 'card-gloss';
      card.appendChild(gloss);

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
        DEPTH_LAYERS.forEach(({ sel }) =>
          card.querySelectorAll(sel).forEach(el => { el.style.transition = ENTER_T; })
        );
      });

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left;
        const y  = e.clientY - r.top;
        const cx = r.width  / 2;
        const cy = r.height / 2;
        const rX = ((y - cy) / cy) * -TILT_MAX;
        const rY = ((x - cx) / cx) *  TILT_MAX;

        card.style.transform =
          `perspective(${PERSP}px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(${LIFT}px)`;
        card.style.boxShadow =
          `${-rY * 2}px ${rX * 2 + 24}px 56px rgba(0,45,85,0.28)`;

        // Push each layer forward at its own Z depth
        DEPTH_LAYERS.forEach(({ sel, z }) =>
          card.querySelectorAll(sel).forEach(el => {
            el.style.transform = `translateZ(${z}px)`;
          })
        );

        // Gloss sits above everything
        gloss.style.transform  = 'translateZ(60px)';
        gloss.style.background =
          `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.55s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
        gloss.style.transform  = '';
        gloss.style.background = '';

        DEPTH_LAYERS.forEach(({ sel }) =>
          card.querySelectorAll(sel).forEach(el => {
            el.style.transition = LEAVE_T;
            el.style.transform  = '';
          })
        );
      });
    });

  // ---- Hero depth layers (mouse parallax) ----
  const layers = [
    { el: document.querySelector('.hero-badge'),       depth: 0.030 },
    { el: document.querySelector('.hero-content h1'),  depth: 0.018 },
    { el: document.querySelector('.hero-content p'),   depth: 0.010 },
    { el: document.querySelector('.hero-buttons'),     depth: 0.005 },
  ].filter(l => l.el);

  document.addEventListener('mousemove', e => {
    if (window.innerWidth <= 900) return;
    const dx = e.clientX - window.innerWidth  / 2;
    const dy = e.clientY - window.innerHeight / 2;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    layers.forEach(({ el }) => { el.style.transform = ''; });
  });
});
