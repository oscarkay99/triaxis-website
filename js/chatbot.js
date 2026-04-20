import { supabase } from './supabase.js';

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

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
- Email: info@triaxistechnologies.com
- Phone: +233 30 123 4567
- Location: Accra, Ghana
- Website contact form: respond within 24 hours
- Free 30-minute discovery call available, proposal within 5 business days

Keep responses short and friendly. Use plain text — no markdown symbols like ** or ##. If someone asks for a calculation (e.g. annual savings, plan costs), compute it and give the exact answer.`;

const conversationHistory = [];

// Lead state machine — tracks structured collection step by step
const lead = { name: null, email: null, preferred_time: null, saved: false };
let collectingLead = false;
let leadStep = null; // 'name' | 'email' | 'time'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function saveLead() {
  if (lead.saved) return;
  lead.saved = true;

  const id = crypto.randomUUID();
  const { error } = await supabase
    .from('chat_leads')
    .insert({ id, name: lead.name, email: lead.email, preferred_time: lead.preferred_time });

  if (!error) {
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ id, name: lead.name, email: lead.email, preferred_time: lead.preferred_time }),
    }).catch(() => {});
  }
}

function wantsToSchedule(text) {
  return /\b(schedule|book|set up|arrange|call|meeting|discovery|appointment|talk|speak)\b/i.test(text);
}

// Returns a bot reply if we're mid-collection, null otherwise
async function handleLeadCollection(userText) {
  if (!collectingLead && !wantsToSchedule(userText)) return null;

  if (!collectingLead) {
    collectingLead = true;
    leadStep = 'name';
    return "I'd be happy to set that up! What's your full name?";
  }

  if (leadStep === 'name') {
    const trimmed = userText.trim();
    if (trimmed.split(' ').length < 2) {
      return "Please provide your full name (first and last name).";
    }
    lead.name = trimmed;
    leadStep = 'email';
    return `Thanks, ${lead.name.split(' ')[0]}! What's your email address?`;
  }

  if (leadStep === 'email') {
    const trimmed = userText.trim();
    if (!EMAIL_RE.test(trimmed)) {
      return "That doesn't look like a valid email. Please try again.";
    }
    lead.email = trimmed;
    leadStep = 'time';
    return "Got it! What date and time works best for you?";
  }

  if (leadStep === 'time') {
    lead.preferred_time = userText.trim();
    const confirmedEmail = lead.email;
    await saveLead();
    // Reset for next booking
    lead.name = null; lead.email = null; lead.preferred_time = null; lead.saved = false;
    collectingLead = false;
    leadStep = null;
    return `Perfect! Your request has been sent to the TriAxis team. They'll review it and send a confirmation to ${confirmedEmail}. Is there anything else I can help you with?`;
  }

  return null;
}

async function getGroqResponse(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...conversationHistory],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response');

  conversationHistory.push({ role: 'assistant', content: reply });
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
    // Lead collection takes priority over AI
    const leadReply = await handleLeadCollection(text);
    if (leadReply) {
      setTyping(false);
      appendMessage('assistant', leadReply);
    } else {
      const reply = await getGroqResponse(text);
      setTyping(false);
      appendMessage('assistant', reply);
    }
  } catch {
    setTyping(false);
    appendMessage('assistant', "Sorry, I'm having trouble connecting right now. Please reach us directly at info@triaxistechnologies.com or +233 30 123 4567.");
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
}

initChatbot();
