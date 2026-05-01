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

        card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
        card.style.transform  =
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

  // Hero mouse parallax is handled by js/parallax.js (combined with scroll)
});
