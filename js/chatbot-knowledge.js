const KNOWLEDGE_CARDS = [
  {
    id: 'software',
    title: 'Custom Software Development',
    keywords: ['software', 'app', 'apps', 'application', 'applications', 'web app', 'mobile app', 'saas', 'platform', 'mvp', 'api', 'custom development'],
    summary: 'We build web apps, mobile apps, APIs, SaaS products, internal business systems, portals, and MVPs.',
    details: 'TriAxis handles discovery, UI and UX design, architecture, backend systems, integrations, QA, deployment, and post-launch support for startups and established businesses.',
    cta: 'If you want, I can also help you book a discovery call so the TriAxis team can scope your software needs properly.',
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure and DevOps',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'devops', 'docker', 'kubernetes', 'migration', 'ci/cd', 'cicd', 'deployment', 'hosting'],
    summary: 'We help businesses design, migrate, secure, automate, and optimize cloud environments across AWS, Azure, and Google Cloud.',
    details: 'This includes architecture design, CI/CD pipelines, containerization, Kubernetes, backups, observability, scaling, uptime, and cost optimization.',
    cta: 'If you are planning a migration or want to improve reliability, I can help you book a discovery call with the TriAxis team.',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity and Compliance',
    keywords: ['cyber', 'security', 'compliance', 'penetration', 'pen test', 'pentest', 'gdpr', 'iso 27001', 'soc 2', 'threat', 'hardening', 'vulnerability'],
    summary: 'We provide cybersecurity reviews, penetration testing, vulnerability management, hardening, monitoring, and compliance support.',
    details: 'TriAxis tailors security work to each business based on risk profile, systems, data sensitivity, and compliance targets such as GDPR or ISO 27001.',
    cta: 'If you want, I can help you book a call so the TriAxis team can assess your security priorities.',
  },
  {
    id: 'data',
    title: 'Data Engineering and Analytics',
    keywords: ['data', 'analytics', 'dashboard', 'dashboards', 'bi', 'warehouse', 'pipeline', 'pipelines', 'bigquery', 'power bi', 'reporting', 'machine learning', 'ml'],
    summary: 'We design data pipelines, warehouses, reporting automation, BI dashboards, and analytics workflows that turn raw data into useful decisions.',
    details: 'This helps teams improve visibility, reporting accuracy, and operational insight across finance, operations, logistics, healthcare, and other sectors.',
    cta: 'If you have a reporting or analytics challenge, I can help you book a discovery call with TriAxis.',
  },
  {
    id: 'consulting',
    title: 'IT Consulting and Strategy',
    keywords: ['consulting', 'strategy', 'roadmap', 'governance', 'advisory', 'vendor selection', 'digital transformation', 'planning', 'architecture'],
    summary: 'We help businesses choose the right technology direction through consulting, roadmaps, architecture planning, and digital transformation support.',
    details: 'TriAxis supports decision-making around platform selection, delivery planning, governance, vendor evaluation, and long-term technology strategy.',
    cta: 'If you want strategic guidance, I can help you schedule a consultation.',
  },
  {
    id: 'managed_it',
    title: 'Managed IT Support and Networking',
    keywords: ['managed it', 'helpdesk', 'support', 'maintenance', 'network', 'networking', 'switch', 'switches', 'router', 'routers', 'firewall', 'firewalls', 'lan', 'wan', 'wifi', 'wi-fi', 'wireless', 'monitoring', 'it support', 'hardware', 'infrastructure'],
    summary: 'We provide ongoing IT support, proactive maintenance, monitoring, networking, user support, and operational reliability services.',
    details: 'That includes office and branch networking, router and firewall setup, Wi-Fi improvements, hardware guidance, network monitoring, and helpdesk support for day-to-day business continuity.',
    cta: 'If you want, I can help you book a call so the TriAxis team can review your networking or support needs.',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    keywords: ['automation', 'automations', 'workflow', 'workflows', 'rpa', 'process automation', 'no-code', 'low-code', 'api integration', 'integrations', 'approval flow'],
    summary: 'We design workflow automations that remove repetitive manual work and improve speed, consistency, and accuracy.',
    details: 'This can include approval flows, CRM and ERP automations, invoice and reporting automations, alerts, integrations between tools, and custom process automation using APIs, no-code, or low-code platforms.',
    cta: 'If you want, I can help you book a discovery call so the team can scope the right automation approach.',
  },
  {
    id: 'cctv',
    title: 'CCTV Installation',
    keywords: ['cctv', 'camera', 'surveillance', 'access control', 'dvr', 'nvr'],
    summary: 'We assess, design, and install CCTV systems with remote viewing, storage planning, and ongoing support.',
    details: 'TriAxis can support offices, schools, retail, warehouses, and residential environments with practical surveillance and access visibility solutions.',
    cta: 'If you want, I can help you schedule a consultation for a CCTV setup.',
  },
  {
    id: 'solar',
    title: 'Solar Installation',
    keywords: ['solar', 'inverter', 'panel', 'panels', 'battery', 'backup power', 'energy backup', 'power solution'],
    summary: 'We help businesses and homes improve power resilience with solar and backup power solutions.',
    details: 'This includes assessment, sizing, inverter and battery planning, installation, and solution design based on your actual energy usage and reliability goals.',
    cta: 'If you want, I can help you book a consultation for a solar or backup power solution.',
  },
  {
    id: 'pricing',
    title: 'Pricing',
    keywords: ['price', 'pricing', 'cost', 'quote', 'estimate', 'budget', 'plan', 'plans'],
    summary: 'Managed IT plans start at $499 per month for Starter and $1,299 per month for Growth, while Enterprise is custom-priced.',
    details: 'Project-based work such as software, cloud, cybersecurity, CCTV, solar, or workflow automation is usually quoted after a short discovery discussion.',
    cta: 'If you want a tailored quote, I can help you book a discovery call.',
  },
  {
    id: 'contact',
    title: 'Contact',
    keywords: ['contact', 'email', 'phone', 'reach', 'call', 'location', 'address'],
    summary: 'You can reach TriAxis at info@triaxistechnologies.com or call 0530848374 / 0593998578.',
    details: 'TriAxis is based in Accra, Ghana, and the team also responds through the website contact form and scheduled discovery calls.',
    cta: 'If you want, I can help you book a discovery call as well.',
  },
];

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreCard(card, queryText) {
  const query = queryText.toLowerCase();
  let score = 0;

  card.keywords.forEach((keyword) => {
    const lower = keyword.toLowerCase();
    if (query.includes(lower)) score += lower.includes(' ') ? 6 : 4;
  });

  tokenize(card.title).forEach((token) => {
    if (query.includes(token)) score += 2;
  });

  return score;
}

export function detectKnowledgeTopic(query, history = []) {
  const combined = [query, ...history.slice(-3).map((entry) => entry.content || '')].join(' ');
  const ranked = KNOWLEDGE_CARDS
    .map((card) => ({ card, score: scoreCard(card, combined) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].card.id : null;
}

export function getRelevantKnowledgeCards(query, history = [], limit = 3) {
  const combined = [query, ...history.slice(-4).map((entry) => entry.content || '')].join(' ');
  return KNOWLEDGE_CARDS
    .map((card) => ({ card, score: scoreCard(card, combined) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.card);
}

export function buildKnowledgeContext(query, history = []) {
  const cards = getRelevantKnowledgeCards(query, history, 3);
  if (!cards.length) return '';

  return cards
    .map((card) => `${card.title}: ${card.summary} ${card.details}`)
    .join('\n');
}

export function getKnowledgeFallbackAnswer(query, history = [], activeTopic = null) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return null;

  const cards = getRelevantKnowledgeCards(trimmed, history, 2);
  const followUp = /\b(tell me more|more about|explain|expand|go deeper|details|how does that work|how do you do that|what about|can you elaborate)\b/i.test(trimmed);

  if (!cards.length && activeTopic) {
    const activeCard = KNOWLEDGE_CARDS.find((card) => card.id === activeTopic);
    if (activeCard && followUp) {
      return `${activeCard.summary} ${activeCard.details} ${activeCard.cta}`;
    }
  }

  if (cards.length === 1) {
    const [card] = cards;
    return `${card.summary} ${card.details} ${card.cta}`;
  }

  if (cards.length >= 2) {
    return `${cards[0].summary} ${cards[0].details} ${cards[1].summary}`;
  }

  if (/\b(service|services|offer|capabilities|what can you do)\b/i.test(trimmed)) {
    return 'We offer custom software development, cloud infrastructure and DevOps, cybersecurity and compliance, data engineering and analytics, IT consulting and strategy, managed IT support and networking, workflow automation, CCTV installation, and solar installation.';
  }

  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i.test(trimmed)) {
    return 'Hi! I can help with services, pricing, project questions, and booking a discovery call.';
  }

  return null;
}
