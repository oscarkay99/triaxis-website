// ===== 3D EFFECTS =====

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---- Card 3D tilt + gloss ----
  const TILT_MAX  = 10;   // max rotation degrees
  const PERSP     = 900;  // perspective distance px
  const LIFT      = 10;   // translateZ lift on hover px

  document.querySelectorAll('.service-card, .portfolio-card, .team-card, .pricing-card')
    .forEach(card => {
      // Inject gloss div
      const gloss = document.createElement('div');
      gloss.className = 'card-gloss';
      card.appendChild(gloss);

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
      });

      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const x   = e.clientX - r.left;
        const y   = e.clientY - r.top;
        const cx  = r.width  / 2;
        const cy  = r.height / 2;
        const rX  = ((y - cy) / cy) * -TILT_MAX;
        const rY  = ((x - cx) / cx) *  TILT_MAX;

        card.style.transform =
          `perspective(${PERSP}px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(${LIFT}px)`;
        card.style.boxShadow =
          `0 ${20 + Math.abs(rX)}px 48px rgba(0,45,85,0.22)`;

        gloss.style.background =
          `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
        gloss.style.background = '';
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
