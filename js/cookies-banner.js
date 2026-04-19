const CONSENT_KEY = 'triaxis-cookie-consent';

function hideBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.add('cookie-hidden');
}

function initCookieBanner() {
  if (localStorage.getItem(CONSENT_KEY)) {
    hideBanner();
    return;
  }

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'all');
    hideBanner();
  });

  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'essential');
    hideBanner();
  });
}

document.addEventListener('DOMContentLoaded', initCookieBanner);
