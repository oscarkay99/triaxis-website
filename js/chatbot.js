const GEMINI_KEY = 'AIzaSyDPsqgMm6MIXNWdFJjUcb7PeWaODUzLg8c';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are the virtual assistant for TriAxis IT Solutions, a professional IT company based in Accra, Ghana. Be helpful, concise, and professional. Only answer questions related to TriAxis or general IT topics relevant to the business. Do not discuss unrelated topics.

Company overview:
- Founded in 2020, 5+ years delivering IT excellence
- 20+ engineers, designers, and strategists
- Serves clients across Africa and beyond
- Industries: finance, healthcare, retail, logistics, education, agriculture

Services:
1. Custom Software Development — web apps, mobile apps, APIs, enterprise platforms, MVPs. All major stacks.
2. Cloud Infrastructure & DevOps — AWS, Azure, Google Cloud, migrations, CI/CD, Docker, Kubernetes.
3. Cybersecurity & Compliance — penetration testing, GDPR/ISO 27001, security audits, 24/7 threat monitoring.
4. Data Engineering & Analytics — data pipelines, warehouses, BI dashboards, BigQuery, Power BI, Python, ML.
5. IT Consulting & Strategy — digital transformation, technology roadmaps, vendor selection, IT governance.
6. Managed IT Support — helpdesk, network monitoring, hardware procurement, proactive maintenance.

Pricing plans:
- Starter: $499/mo ($384/mo billed annually) — up to 10 users, business-hours helpdesk, basic monitoring, monthly security scan, 100GB backup.
- Growth: $1,299/mo ($999/mo billed annually) — up to 50 users, 24/7 helpdesk, advanced monitoring, weekly security audits, 1TB backup, dedicated account manager, 1 custom software project/year. Most popular.
- Enterprise: Custom pricing — unlimited users, 24/7 priority SLA, full SOC, unlimited custom development, dedicated engineering team, on-site support, executive IT consulting.

Contact:
- Email: hello@triaxis.tech
- Phone: +233 30 123 4567
- Location: Accra, Ghana
- Website contact form: respond within 24 hours
- Free 30-minute discovery call available, proposal within 5 business days

Keep responses short and friendly. Use plain text — no markdown symbols like ** or ##. If someone asks for a calculation (e.g. annual savings, plan costs), compute it and give the exact answer.`;

const conversationHistory = [];

async function getGeminiResponse(userMessage) {
  conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: conversationHistory,
    generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('Empty response');

  conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
  return reply;
}

function appendMessage(role, text) {
  const log = document.getElementById('cb-log');
  const wrap = document.createElement('div');
  wrap.className = `cb-msg cb-msg--${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  bubble.innerHTML = role === 'assistant'
    ? text.replace(/</g, '&lt;').replace(/\n/g, '<br>')
    : text.replace(/</g, '&lt;');
  wrap.appendChild(bubble);
  log.appendChild(wrap);
  log.scrollTop = log.scrollHeight;
}

function setTyping(show) {
  const existing = document.getElementById('cb-typing');
  if (show && !existing) {
    const log = document.getElementById('cb-log');
    const wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg--assistant';
    wrap.id = 'cb-typing';
    wrap.innerHTML = '<div class="cb-bubble cb-typing-dots"><span></span><span></span><span></span></div>';
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  } else if (!show && existing) {
    existing.remove();
  }
}

function setInputDisabled(disabled) {
  document.getElementById('cb-input').disabled = disabled;
  document.getElementById('cb-send').disabled = disabled;
}

async function handleSend() {
  const input = document.getElementById('cb-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage('user', text);
  setTyping(true);
  setInputDisabled(true);

  try {
    const reply = await getGeminiResponse(text);
    setTyping(false);
    appendMessage('assistant', reply);
  } catch {
    setTyping(false);
    appendMessage('assistant', "Sorry, I'm having trouble connecting right now. Please reach us directly at hello@triaxis.tech or +233 30 123 4567.");
  } finally {
    setInputDisabled(false);
    document.getElementById('cb-input').focus();
  }
}

function initChatbot() {
  const toggleBtn = document.getElementById('cb-toggle');
  const closeBtn = document.getElementById('cb-close');
  const widget = document.getElementById('cb-widget');
  const cbWindow = document.getElementById('cb-window');
  const input = document.getElementById('cb-input');
  const form = document.getElementById('cb-form');

  toggleBtn.addEventListener('click', () => {
    const isOpen = cbWindow.classList.toggle('cb-window--open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    widget.classList.toggle('cb-hide-label', isOpen);
    if (isOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    cbWindow.classList.remove('cb-window--open');
    toggleBtn.setAttribute('aria-expanded', false);
    widget.classList.remove('cb-hide-label');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSend();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

initChatbot();
