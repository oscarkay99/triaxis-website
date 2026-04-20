import { supabase } from './supabase.js';

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

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
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

    form.reset();
    charCountEl.textContent = '(0/500)';
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 5000);
  });
}
