import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  // TEMP: log basic info (safe) and disable honeypot short-circuit for debugging
  try {
    const email = (req.body?.email || '').toString().trim().toLowerCase();
    const role  = (req.body?.role  || 'LIFE').toString().toUpperCase();
    const source = (req.body?.source || 'hempin.org').toString();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) return res.status(400).json({ ok: false, error: 'Invalid email' });

    if (!['WORK','LIFE'].includes(role)) {
      return res.status(400).json({ ok: false, error: 'Invalid role' });
    }

    // Attempt insert and return id so we can confirm server-side success
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({ email, role, source })
      .select('id')
      .single();

    if (error) {
      console.error('[lead.insert] error:', error); // visible in Netlify logs
      // If you later add a unique index on email, handle dedupe:
      if ((error as any).code === '23505') return res.status(200).json({ ok: true, dedupe: true });
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, id: data?.id, role, source });
  } catch (e: any) {
    console.error('[lead.handler] exception:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'server error' });
  }
}