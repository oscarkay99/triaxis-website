const APPS_SCRIPT_URL = Deno.env.get('APPS_SCRIPT_URL') ?? '';

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

    const company = parts['Company'] || '';
    const service = parts['Service'] || '';
    const project = parts['Project'] || '';

    // Call the existing Apps Script via URL-encoded form (matches e.parameter in doPost)
    const body = new URLSearchParams({
      name:    name    ?? '',
      email:   email   ?? '',
      company: company,
      service: service,
      project: project,
      details: raw,
    });

    await fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
