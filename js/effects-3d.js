// ===== 3D EFFECTS =====

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TILT  = 7;     // max rotation degrees — subtle, not dramatic
  const PERSP = 1000;  // high value = gentle perspective

  document.querySelectorAll('.service-card, .portfolio-card, .team-card, .pricing-card')
    .forEach(card => {
      const gloss = document.createElement('div');
      gloss.className = 'card-gloss';
      card.appendChild(gloss);

      // Image inside the card — parallaxes opposite to tilt (window-depth illusion)
      const img = card.querySelector('.service-img-wrap img, .portfolio-img-wrap img');

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      });

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left;
        const y  = e.clientY - r.top;
        const cx = r.width  / 2;
        const cy = r.height / 2;
        const rX = ((y - cy) / cy) * -TILT;
        const rY = ((x - cx) / cx) *  TILT;

        card.style.transform =
          `perspective(${PERSP}px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`;
        card.style.boxShadow =
          `${-rY * 1.2}px ${Math.abs(rX) * 1.2 + 16}px 40px rgba(0,45,85,0.18)`;

        // Image drifts opposite the tilt — creates depth without Z-translation
        if (img) {
          img.style.transform = `scale(1.06) translate(${rY * -0.4}px, ${rX * 0.4}px)`;
        }

        gloss.style.background =
          `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 58%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
        card.style.transform  = '';
        card.style.boxShadow  = '';
        gloss.style.background = '';
        if (img) {
          img.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
          img.style.transform  = '';
        }
      });
    });

  // ---- Hero depth layers (mouse parallax) ----
  const layers = [
    { el: document.querySelector('.hero-badge'),       depth: 0.025 },
    { el: document.querySelector('.hero-content h1'),  depth: 0.014 },
    { el: document.querySelector('.hero-content p'),   depth: 0.008 },
    { el: document.querySelector('.hero-buttons'),     depth: 0.004 },
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
