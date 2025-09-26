import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[lead] ENTRY', { method: req.method });

  if (req.method !== 'POST') {
    console.warn('[lead] wrong method', req.method);
    return res.status(405).json({ ok:false, error:'Method not allowed' });
  }

  // Show raw body (so we can see exactly what arrives)
  console.log('[lead] raw body:', req.body);

  // Honeypot check
  const honey = (typeof req.body?.company === 'string' ? req.body.company : '').trim();
  if (honey) {
    console.warn('[lead] honeypot hit. Payload:', req.body);
    return res.status(200).json({ ok:true, honey:true });
  }

  const email  = (req.body?.email  || '').toString().trim().toLowerCase();
  const role   = (req.body?.role   || 'LIFE').toString().toUpperCase();
  const source = (req.body?.source || 'hempin.org').toString();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!emailOk) {
    console.warn('[lead] invalid email:', email);
    return res.status(400).json({ ok:false, error:'Invalid email' });
  }
  if (!['WORK','LIFE'].includes(role)) {
    console.warn('[lead] invalid role:', role);
    return res.status(400).json({ ok:false, error:'Invalid role' });
  }

  console.log('[lead] inserting →', { email, role, source });

  const { error } = await supabaseAdmin.from('leads').insert({ email, role, source });

  if (error) {
    console.error('[lead.insert] error:', error);
    if ((error as any)?.code === '23505') {
      console.log('[lead.insert] duplicate → returning ok');
      return res.status(200).json({ ok:true, dedupe:true });
    }
    return res.status(500).json({ ok:false, error:error.message });
  }

  console.log('[lead.insert] success');
  return res.status(200).json({ ok:true, inserted:true });
}