// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

const heroObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) { animateCounters(); heroObserver.disconnect(); }
}, { threshold: 0.3 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

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

document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => { goTo(i); resetAuto(); }));

function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => goTo(current + 1), 5000); }
autoSlide = setInterval(() => goTo(current + 1), 5000);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-icon').textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('active');
      item.querySelector('.faq-icon').textContent = '−';
    }
  });
});

// ===== PRICING TOGGLE =====
const monthlyBtn = document.getElementById('monthlyBtn');
const annualBtn = document.getElementById('annualBtn');
const priceEls = document.querySelectorAll('.price-amount[data-monthly]');

monthlyBtn.addEventListener('click', () => {
  monthlyBtn.classList.add('active');
  annualBtn.classList.remove('active');
  priceEls.forEach(el => { el.textContent = '$' + el.dataset.monthly; });
});

annualBtn.addEventListener('click', () => {
  annualBtn.classList.add('active');
  monthlyBtn.classList.remove('active');
  priceEls.forEach(el => { el.textContent = '$' + el.dataset.annual; });
});

// ===== CHARACTER COUNTER =====
const messageEl = document.getElementById('message');
const charCountEl = document.getElementById('charCount');
if (messageEl) {
  messageEl.addEventListener('input', () => {
    charCountEl.textContent = `(${messageEl.value.length}/500)`;
  });
}

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.fullName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      form.reset();
      charCountEl.textContent = '(0/500)';
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 5000);
    }, 1200);
  });
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .portfolio-card, .team-card, .pricing-card, .faq-item, .value-card, .contact-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
