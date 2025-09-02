// pages/api/admin/review/events.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { requireAdmin } from '../_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { only = 'all' } = req.query
    const base = supabaseAdmin.from('events').select('id,title,slug,status,featured,city,country,created_at')
    const q = only === 'pending' ? base.eq('status', 'pending') : base
    const { data, error } = await q.order('created_at', { ascending: false }).limit(200)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ rows: data })
  }

  if (req.method === 'PATCH') {
    const { id, status, featured } = req.body as { id: string; status?: 'approved'|'pending'|'rejected'; featured?: boolean }
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const patch: any = {}
    if (status) patch.status = status
    if (featured !== undefined) patch.featured = featured
    const { error } = await supabaseAdmin.from('events').update(patch).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  res.setHeader('Allow', ['GET', 'PATCH'])
  res.status(405).end('Method Not Allowed')
}