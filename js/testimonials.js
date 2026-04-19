// ===== TESTIMONIAL SLIDER =====
const slides = document.querySelectorAll('.testimonial-slide');
const thumbs = document.querySelectorAll('.thumb');
const dotsContainer = document.getElementById('sliderDots');
let current = 0;
let autoSlide;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.slider-dot');

function goTo(index) {
  slides[current].classList.remove('active');
  thumbs[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  thumbs[current].classList.add('active');
  dots[current].classList.add('active');
}

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goTo(current + 1), 5000);
}

document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => { goTo(i); resetAuto(); }));

autoSlide = setInterval(() => goTo(current + 1), 5000);
