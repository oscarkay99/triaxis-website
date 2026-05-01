const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const NOTIFY_EMAIL   = 'info@triaxistechnologies.com';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record  = payload.record;
    if (!record) return new Response('No record', { status: 400 });

    const { name, email, preferred_time } = record;
    const raw        = preferred_time ?? '';
    const isBooking  = raw.startsWith('[Discovery Call Request]');

    // Parse "Key: Value" segments from the preferred_time string
    const parts: Record<string, string> = {};
    raw.split('|').forEach((seg: string) => {
      const colon = seg.indexOf(':');
      if (colon > -1) {
        parts[seg.slice(0, colon).trim()] = seg.slice(colon + 1).trim();
      }
    });

    const company = parts['Company'] || '—';
    const service = parts['Service'] || '—';
    const project = parts['Project'] || '—';

    const subject = isBooking
      ? `New Discovery Call Request — ${name}`
      : `New Chat Lead — ${name}`;

    const text = [
      isBooking ? '=== DISCOVERY CALL REQUEST ===' : '=== CHAT LEAD ===',
      '',
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Company: ${company}`,
      `Service: ${service}`,
      `Project: ${project}`,
      '',
      isBooking
        ? 'ACTION REQUIRED: Review and send the Calendly link if approved:\nhttps://calendly.com/triaxistechnologies-info/30min'
        : 'Info lead — follow up at your convenience.',
    ].join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TriAxis Notifications <onboarding@resend.dev>',
        to:   [NOTIFY_EMAIL],
        subject,
        text,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, resend: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
