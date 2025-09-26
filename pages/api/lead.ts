import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // QUICK HEALTH CHECK (visit /api/lead?health=1 in your browser)
  if (req.method === 'GET' && 'health' in req.query) {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    return res.status(200).json({
      ok: true,
      route: '/api/lead',
      env: { supabaseUrlSet: hasUrl, serviceRoleSet: hasKey },
      note: 'POST to /api/lead with {email, role} to insert',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Honeypot is optional; keep empty in UI if you use it
    const email  = (req.body?.email  || '').toString().trim().toLowerCase();
    const role   = (req.body?.role   || 'LIFE').toString().toUpperCase();
    const source = (req.body?.source || 'hempin.org').toString();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) return res.status(400).json({ ok: false, error: 'Invalid email' });
    if (!['WORK', 'LIFE'].includes(role)) {
      return res.status(400).json({ ok: false, error: 'Invalid role' });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({ email, role, source })
      .select('id')
      .single();

    if (error) {
      // Unique violation (if you add a unique index later)
      if ((error as any).code === '23505') return res.status(200).json({ ok: true, dedupe: true });
      console.error('[lead.insert] error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (e: any) {
    console.error('[lead.handler] exception:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'server error' });
  }
}