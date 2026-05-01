// ===== 3D EFFECTS =====

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TILT  = 4;
  const PERSP = 1200;

  document.querySelectorAll('.service-card, .portfolio-card, .team-card, .pricing-card')
    .forEach(card => {
      const gloss = document.createElement('div');
      gloss.className = 'card-gloss';
      card.appendChild(gloss);

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left;
        const y  = e.clientY - r.top;
        const rX = ((y - r.height / 2) / (r.height / 2)) * -TILT;
        const rY = ((x - r.width  / 2) / (r.width  / 2)) *  TILT;

        card.style.transform =
          `perspective(${PERSP}px) rotateX(${rX}deg) rotateY(${rY}deg)`;

        gloss.style.background =
          `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
        card.style.transform  = '';
        gloss.style.background = '';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });

  // ---- Hero depth layers (mouse parallax) ----
  const layers = [
    { el: document.querySelector('.hero-badge'),       depth: 0.018 },
    { el: document.querySelector('.hero-content h1'),  depth: 0.010 },
    { el: document.querySelector('.hero-content p'),   depth: 0.006 },
    { el: document.querySelector('.hero-buttons'),     depth: 0.003 },
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
