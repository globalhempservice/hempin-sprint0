import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  // Basic honeypot
  const honey = (req.body?.company || '').toString().trim();
  if (honey) return res.status(200).json({ ok:true }); // pretend success

  const email = (req.body?.email || '').toString().trim().toLowerCase();
  const role  = (req.body?.role  || 'LIFE').toString().toUpperCase();
  const source = (req.body?.source || 'hempin.org').toString();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!emailOk) return res.status(400).json({ ok:false, error:'Invalid email' });

  if (!['WORK','LIFE'].includes(role)) return res.status(400).json({ ok:false, error:'Invalid role' });

  const { error } = await supabaseAdmin
    .from('leads')
    .insert({ email, role, source });

  if (error) {
    // allow idempotent UX: if unique violation, still return ok
    if (error.code === '23505') return res.status(200).json({ ok:true, dedupe:true });
    return res.status(500).json({ ok:false, error:error.message });
  }
  return res.status(200).json({ ok:true });
}