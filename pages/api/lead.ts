import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req.query.health) {
    return res.status(200).json({
      ok: true,
      route: '/api/lead',
      env: {
        supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleSet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      note: 'POST to /api/lead with {email, role} to insert',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    // Basic honeypot
    const honey = (req.body?.company || '').toString().trim();
    if (honey) return res.status(200).json({ ok:true, skipped:'honeypot' });

    const email = (req.body?.email || '').toString().trim().toLowerCase();
    const role  = (req.body?.role  || 'LIFE').toString().toUpperCase();
    const source = (req.body?.source || 'hempin.org').toString();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) return res.status(400).json({ ok:false, error:'Invalid email' });

    if (!['WORK','LIFE'].includes(role)) return res.status(400).json({ ok:false, error:'Invalid role' });

    const { error } = await supabaseAdmin.from('leads').insert({ email, role, source });

    if (error) {
      // Log to Netlify function logs
      console.error('[lead.insert] error:', error);
      // Accept duplicate gracefully but tell the client (so we can see it)
      if ((error as any).code === '23505') {
        return res.status(200).json({ ok:true, dedupe:true });
      }
      return res.status(500).json({ ok:false, error: error.message, code: (error as any).code });
    }

    return res.status(200).json({ ok:true });
  } catch (e: any) {
    console.error('[lead.handler] exception:', e);
    return res.status(500).json({ ok:false, error: e?.message || 'server error' });
  }
}