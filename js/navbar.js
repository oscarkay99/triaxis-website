// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('triaxis-theme', theme);
  } catch {
    // Theme still changes for the current visit if storage is unavailable.
  }
  if (!themeToggle) return;

  const isNight = theme === 'night';
  themeToggle.setAttribute('aria-pressed', String(isNight));
  themeToggle.setAttribute('aria-label', isNight ? 'Switch to day mode' : 'Switch to night mode');
};

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

if (themeToggle) {
  setTheme(document.documentElement.dataset.theme || 'day');

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    setTheme(nextTheme);
  });
}
