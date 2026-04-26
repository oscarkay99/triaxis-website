import { supabase } from './supabase.js';

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY; // only set in local dev
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
- Phone: 0530848374 / 0593998578
- Location: Accra, Ghana
- Website contact form: respond within 24 hours
- Free 30-minute discovery call available, proposal within 5 business days

Keep responses short and friendly. Use plain text — no markdown symbols like ** or ##. If someone asks for a calculation (e.g. annual savings, plan costs), compute it and give the exact answer.`;

const conversationHistory = [];

const lead = { name: null, email: null, preferred_time: null, saved: false };
let collectingLead = false;
let leadStep = null; // 'name' | 'email' | 'time' | 'interest'
let leadSource = null; // 'schedule' | 'info'
let infoInterestDetected = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting
let lastSendTime = 0;
let sessionMessageCount = 0;
const SEND_COOLDOWN_MS = 3000;
const MAX_SESSION_MESSAGES = 50;

async function saveLead() {
  if (lead.saved) return;
  lead.saved = true;

  const id = crypto.randomUUID();
  await supabase
    .from('chat_leads')
    .insert({ id, name: lead.name, email: lead.email, preferred_time: lead.preferred_time });
}

function wantsToSchedule(text) {
  return /\b(schedule|book|set up|arrange|call|meeting|discovery|appointment|talk|speak)\b/i.test(text);
}

function wantsInfo(text) {
  return /\b(price|pricing|cost|how much|afford|budget|quote|estimate|service|package|solution|plan|offer|start|begin|get started|interested|more info|details|learn more|tell me more|capabilities|what can you|work with|need help|looking for|require|my (company|business|team|project)|we need|i need|can you help|would you|do you (handle|offer|do|provide)|our (company|business|team))\b/i.test(text);
}

function wantsToDecline(text) {
  return /\b(no|nope|not now|later|no thanks|skip|don't|not interested|maybe later|not yet|some other time)\b/i.test(text);
}

async function handleLeadCollection(userText) {
  if (!collectingLead && !wantsToSchedule(userText)) return null;

  // Handle declines gracefully at the name step
  if (collectingLead && leadStep === 'name' && wantsToDecline(userText)) {
    collectingLead = false;
    leadStep = null;
    leadSource = null;
    return "No problem at all! Feel free to reach out whenever you're ready. Is there anything else I can help you with?";
  }

  if (!collectingLead) {
    collectingLead = true;
    leadStep = 'name';
    leadSource = 'schedule';
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
    if (leadSource === 'info') {
      leadStep = 'interest';
      return "Perfect! What service or solution are you most interested in?";
    }
    leadStep = 'time';
    return "Got it! What date and time works best for you?";
  }

  if (leadStep === 'interest') {
    lead.preferred_time = `[Info request] ${userText.trim()}`;
    const confirmedEmail = lead.email;
    await saveLead();
    lead.name = null; lead.email = null; lead.preferred_time = null; lead.saved = false;
    collectingLead = false;
    leadStep = null;
    leadSource = null;
    return `Great! I've passed your details to the TriAxis team and they'll reach out to you at ${confirmedEmail} shortly. Is there anything else I can help with?`;
  }

  if (leadStep === 'time') {
    lead.preferred_time = userText.trim();
    const confirmedEmail = lead.email;
    await saveLead();
    lead.name = null; lead.email = null; lead.preferred_time = null; lead.saved = false;
    collectingLead = false;
    leadStep = null;
    leadSource = null;
    return `Perfect! Your request has been sent to the TriAxis team. They'll review it and send a confirmation to ${confirmedEmail}. Is there anything else I can help you with?`;
  }

  return null;
}

function shouldPromptForLead(userText) {
  if (lead.saved || collectingLead || infoInterestDetected) return false;
  if (sessionMessageCount < 2) return false;
  return wantsInfo(userText);
}

async function getGroqResponse(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  const fullMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...conversationHistory];
  let reply;

  if (GROQ_KEY) {
    // Local dev: call Groq directly (key only exists in .env, never in production build)
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    reply = data.choices?.[0]?.message?.content;
  } else {
    // Production: Groq key lives server-side in the edge function
    const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ messages: fullMessages }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    reply = data.reply;
  }

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
  const now = Date.now();
  if (now - lastSendTime < SEND_COOLDOWN_MS) return;

  if (sessionMessageCount >= MAX_SESSION_MESSAGES) {
    appendMessage('assistant', "You've reached the session limit. Please contact us directly at info@triaxistechnologies.com or 0530848374 / 0593998578.");
    return;
  }

  const input = document.getElementById('cb-input');
  const text = input.value.trim();
  if (!text || text.length > 300) return;

  lastSendTime = now;
  sessionMessageCount++;
  input.value = '';
  appendMessage('user', text);
  setTyping(true);
  setInputDisabled(true);

  try {
    const leadReply = await handleLeadCollection(text);
    if (leadReply) {
      setTyping(false);
      appendMessage('assistant', leadReply);
    } else {
      const reply = await getGroqResponse(text);
      setTyping(false);
      appendMessage('assistant', reply);

      if (shouldPromptForLead(text)) {
        infoInterestDetected = true;
        collectingLead = true;
        leadStep = 'name';
        leadSource = 'info';
        setTimeout(() => {
          appendMessage('assistant', "It sounds like you're looking for the right IT partner. I'd love to connect you with our team — what's your full name?");
        }, 800);
      }
    }
  } catch {
    setTyping(false);
    appendMessage('assistant', "Sorry, I'm having trouble connecting right now. Please reach us directly at info@triaxistechnologies.com or 0530848374 / 0593998578.");
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
