import { supabase } from './supabase.js';

const CALENDLY_URL = 'https://calendly.com/triaxistechnologies-info/30min?hide_gdpr_banner=1';

const scheduleBtn = document.getElementById('scheduleCallBtn');
if (scheduleBtn) {
  scheduleBtn.addEventListener('click', () => {
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open('https://calendly.com/triaxistechnologies-info/30min', '_blank', 'noopener');
    }
  });
}

// Character counter
const messageEl = document.getElementById('message');
const charCountEl = document.getElementById('charCount');
if (messageEl) {
  messageEl.addEventListener('input', () => {
    charCountEl.textContent = `(${messageEl.value.length}/500)`;
  });
}

// Form submission
const form = document.getElementById('contactForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

const CONTACT_COOLDOWN_KEY = 'triaxis-last-contact';
const CONTACT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const lastContact = parseInt(localStorage.getItem(CONTACT_COOLDOWN_KEY) || '0', 10);
      const waitMs = CONTACT_COOLDOWN_MS - (Date.now() - lastContact);
      if (waitMs > 0) {
        const waitMin = Math.ceil(waitMs / 60000);
        alert(`Please wait ${waitMin} minute${waitMin !== 1 ? 's' : ''} before sending another message.`);
        return;
      }
    } catch { /* storage unavailable, allow submit */ }

    const name = form.fullName.value.trim();
    const email = form.email.value.trim();
    const service = form.service?.value || null;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const { error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, service, message });

    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;

    if (error) {
      alert('Something went wrong. Please email us directly at info@triaxistechnologies.com');
      return;
    }

    try { localStorage.setItem(CONTACT_COOLDOWN_KEY, Date.now().toString()); } catch { /* ignore */ }

    form.reset();
    charCountEl.textContent = '(0/500)';
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 5000);
  });
}
