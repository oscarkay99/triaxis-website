const RESPONSES = {
  greeting: [
    "Hi there! I'm the TriAxis assistant. How can I help you today? You can ask me about our services, pricing, or how to get started.",
    "Hello! Welcome to TriAxis IT Solutions. I'm here to help. Ask me anything about our services, pricing, or team.",
    "Hey! Great to have you here. I can tell you about what we do, our pricing plans, or how to reach our team.",
  ],
  services: "We offer six core services: **Custom Software Development**, **Cloud Infrastructure & DevOps**, **Cybersecurity & Compliance**, **Data Engineering & Analytics**, **IT Consulting & Strategy**, and **Managed IT Support**. Which one would you like to know more about?",
  software: "Our Custom Software Development team builds scalable web apps, mobile apps, APIs, and enterprise platforms — from MVPs to full-scale systems. We work across all major stacks and tailor every solution to your exact business needs.",
  cloud: "We handle end-to-end cloud solutions on AWS, Azure, and Google Cloud — including migrations, CI/CD pipelines, containerization (Docker/Kubernetes), and ongoing infrastructure management.",
  security: "Our cybersecurity team provides penetration testing, GDPR/ISO 27001 compliance consulting, security audits, and 24/7 threat monitoring to keep your business protected.",
  data: "We turn raw data into actionable insights — designing data pipelines, warehouses, and BI dashboards using tools like BigQuery, Power BI, Python, and ML models.",
  consulting: "Our IT consulting covers digital transformation strategy, technology roadmaps, vendor selection, and IT governance frameworks to align your tech with your business goals.",
  support: "Our Managed IT Support provides helpdesk assistance, network monitoring, hardware procurement, and proactive maintenance — so your team stays productive without IT headaches.",
  pricing: "We have three plans:\n\n• **Starter** — $499/mo ($384 billed annually): Up to 10 users, business-hours helpdesk, basic monitoring, monthly security scan, 100GB backup.\n\n• **Growth** — $1,299/mo ($999 billed annually): Up to 50 users, 24/7 helpdesk, advanced monitoring, weekly security audits, 1TB backup, dedicated account manager, 1 custom software project/year. Most popular!\n\n• **Enterprise** — Custom pricing: Unlimited users, 24/7 priority SLA, full SOC, unlimited custom development, dedicated engineering team.\n\nContact us for a tailored quote.",
  starter: "The Starter plan is $499/month ($384/mo billed annually). It covers up to 10 users with business-hours helpdesk, basic network monitoring, monthly security scans, 100GB cloud backup, and email & chat support. Great for small teams getting started.",
  growth: "The Growth plan is $1,299/month ($999/mo billed annually) and is our most popular option. It supports up to 50 users with 24/7 helpdesk, advanced monitoring, weekly security audits, 1TB backup, a dedicated account manager, and one custom software project per year.",
  enterprise: "The Enterprise plan has custom pricing based on your needs. It includes unlimited users, 24/7 priority support with SLA guarantees, a full security operations center, unlimited custom software development, a dedicated engineering team, on-site support, and executive IT consulting.",
  contact: "You can reach us at:\n\n📧 hello@triaxis.tech\n📞 +233 30 123 4567\n📍 Accra, Ghana\n\nOr fill out the contact form on our website — we typically respond within 24 hours.",
  location: "We're based in Accra, Ghana, and serve clients across Africa and beyond.",
  start: "Getting started is simple! Just fill out the contact form on our website or give us a call at +233 30 123 4567. We'll schedule a free 30-minute discovery call to understand your needs, then deliver a detailed proposal and project roadmap within 5 business days.",
  about: "TriAxis IT Solutions was founded in 2020 and has been delivering IT excellence for 5+ years. We have a team of 20+ engineers, designers, and strategists with deep expertise across finance, healthcare, retail, logistics, education, and agriculture.",
  team: "Our team of 20+ professionals includes engineers, designers, and strategists. Leadership includes our CEO (15 years in enterprise software, former CTO at TechBridge Africa), our CTO, Head of Cybersecurity, and Head of Product Design — all passionate about solving real business challenges with technology.",
  industries: "We have deep experience across finance, healthcare, retail, logistics, education, and agriculture. However, our team is adaptable and has successfully delivered projects across many other sectors as well.",
  quote: "To get a custom quote, please fill out our contact form or reach us at hello@triaxis.tech / +233 30 123 4567. We'll set up a free 30-minute discovery call and have a detailed proposal ready within 5 business days.",
  fallback: [
    "That's a great question! For detailed information on that, I'd recommend reaching out directly to our team at hello@triaxis.tech or calling +233 30 123 4567. We're happy to help.",
    "I'm best at answering questions about TriAxis services, pricing, and getting started. For anything beyond that, our team at hello@triaxis.tech would be the right contact.",
    "I don't have a specific answer for that, but our team does! Reach us at hello@triaxis.tech or +233 30 123 4567 — we respond within 24 hours.",
  ],
};

const greetCount = { n: 0 };
const fallbackCount = { n: 0 };

function pickRandom(arr, counter) {
  const reply = arr[counter.n % arr.length];
  counter.n++;
  return reply;
}

function getResponse(input) {
  const t = input.toLowerCase();

  if (/\b(hi|hello|hey|good (morning|afternoon|evening)|howdy|greetings|sup|what'?s up)\b/.test(t)) {
    return pickRandom(RESPONSES.greeting, greetCount);
  }
  if (/\b(starter|basic|small|entry).*(plan|package|tier|price|cost|pricing)\b|\bplan.*(starter|basic)\b/.test(t)) return RESPONSES.starter;
  if (/\b(growth|mid|medium|popular).*(plan|package|tier|price|cost|pricing)\b|\bplan.*(growth|mid)\b/.test(t)) return RESPONSES.growth;
  if (/\b(enterprise|large|corporate|big|custom).*(plan|package|tier|price|cost|pricing)\b|\bplan.*(enterprise|custom)\b/.test(t)) return RESPONSES.enterprise;
  if (/\b(price|pricing|cost|fee|rate|charge|plan|package|afford|budget|how much|subscription)\b/.test(t)) return RESPONSES.pricing;
  if (/\b(custom software|software dev|web (app|development)|mobile (app|development)|app dev|build.*app|develop|api|saas|mvp)\b/.test(t)) return RESPONSES.software;
  if (/\b(cloud|aws|azure|gcp|google cloud|devops|ci\/cd|docker|kubernetes|migration|infrastructure)\b/.test(t)) return RESPONSES.cloud;
  if (/\b(security|cybersecurity|cyber|gdpr|iso|compliance|penetration|pen test|audit|threat|soc|hack)\b/.test(t)) return RESPONSES.security;
  if (/\b(data|analytics|bi|business intelligence|dashboard|pipeline|bigquery|power bi|machine learning|ml|warehouse)\b/.test(t)) return RESPONSES.data;
  if (/\b(consult|strategy|roadmap|digital transform|governance|vendor|advisory)\b/.test(t)) return RESPONSES.consulting;
  if (/\b(managed|support|helpdesk|help desk|monitoring|network|maintenance|it support)\b/.test(t)) return RESPONSES.support;
  if (/\b(service|offer|provide|do you|what (do|can)|solution|capability)\b/.test(t)) return RESPONSES.services;
  if (/\b(contact|email|phone|call|reach|get in touch|number|address|mail)\b/.test(t)) return RESPONSES.contact;
  if (/\b(where|location|based|office|accra|ghana|country|city)\b/.test(t)) return RESPONSES.location;
  if (/\b(start|begin|get started|onboard|sign up|how (do|to)|first step|process|next step)\b/.test(t)) return RESPONSES.start;
  if (/\b(about|company|founded|history|background|story|who are|triaxis)\b/.test(t)) return RESPONSES.about;
  if (/\b(team|staff|people|expert|engineer|developer|designer|employee|member)\b/.test(t)) return RESPONSES.team;
  if (/\b(industry|sector|field|finance|health|retail|logistic|education|agriculture|banking)\b/.test(t)) return RESPONSES.industries;
  if (/\b(quote|proposal|estimate|scope|project cost)\b/.test(t)) return RESPONSES.quote;

  return pickRandom(RESPONSES.fallback, fallbackCount);
}

function formatBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function appendMessage(role, text) {
  const log = document.getElementById('cb-log');
  const wrap = document.createElement('div');
  wrap.className = `cb-msg cb-msg--${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'cb-bubble';
  bubble.innerHTML = role === 'assistant' ? formatBold(text) : text.replace(/</g, '&lt;');
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

function handleSend() {
  const input = document.getElementById('cb-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage('user', text);
  setTyping(true);

  setTimeout(() => {
    setTyping(false);
    appendMessage('assistant', getResponse(text));
  }, 600);
}

function initChatbot() {
  const toggleBtn = document.getElementById('cb-toggle');
  const closeBtn = document.getElementById('cb-close');
  const widget = document.getElementById('cb-widget');
  const window_ = document.getElementById('cb-window');
  const input = document.getElementById('cb-input');
  const form = document.getElementById('cb-form');

  toggleBtn.addEventListener('click', () => {
    const isOpen = window_.classList.toggle('cb-window--open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    widget.classList.toggle('cb-hide-label', isOpen);
    if (isOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    window_.classList.remove('cb-window--open');
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
