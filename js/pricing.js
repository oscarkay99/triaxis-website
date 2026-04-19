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
