import './styles/base.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/legal.css';
import './styles/responsive.css';

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

if (themeToggle) {
  setTheme(document.documentElement.dataset.theme || 'day');
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    setTheme(nextTheme);
  });
}
