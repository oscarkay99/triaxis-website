const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const TO_EMAIL = 'info@triaxistechnologies.com';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record  = payload.record;
    if (!record) return new Response('No record', { status: 400 });

    const { name, email, preferred_time } = record;
    const raw = preferred_time ?? '';

    // Parse "Key: Value" segments from preferred_time
    const parts: Record<string, string> = {};
    raw.split('|').forEach((seg: string) => {
      const colon = seg.indexOf(':');
      if (colon > -1) {
        parts[seg.slice(0, colon).trim()] = seg.slice(colon + 1).trim();
      }
    });

    const company = parts['Company'] || 'N/A';
    const service = parts['Service'] || 'N/A';
    const project = parts['Project'] || 'N/A';
    const isBooking = raw.includes('Discovery Call Request');

    const subject = isBooking
      ? `New Discovery Call Request — ${name}`
      : `New Lead — ${name}`;

    const html = `
<h2 style="margin:0 0 16px">${isBooking ? '📅 Discovery Call Request' : '💬 New Lead'}</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:15px">
  <tr><td style="padding:8px 12px;font-weight:600;width:140px">Name</td><td style="padding:8px 12px">${name ?? ''}</td></tr>
  <tr style="background:#f5f5f5"><td style="padding:8px 12px;font-weight:600">Email</td><td style="padding:8px 12px">${email ?? ''}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:600">Company</td><td style="padding:8px 12px">${company}</td></tr>
  <tr style="background:#f5f5f5"><td style="padding:8px 12px;font-weight:600">Service</td><td style="padding:8px 12px">${service}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:600">Project</td><td style="padding:8px 12px">${project}</td></tr>
  <tr style="background:#f5f5f5"><td style="padding:8px 12px;font-weight:600">Raw Details</td><td style="padding:8px 12px;color:#555">${raw}</td></tr>
</table>
<p style="margin:20px 0 0;font-size:13px;color:#888">Sent via TriAxis website chatbot</p>
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    'TriAxis Notifications <onboarding@resend.dev>',
        to:      [TO_EMAIL],
        subject,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: res.ok, data }), {
      status: res.ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
