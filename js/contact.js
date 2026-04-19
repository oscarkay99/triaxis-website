// ===== CONTACT SECTION =====
// Owner: contact section collaborator

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
