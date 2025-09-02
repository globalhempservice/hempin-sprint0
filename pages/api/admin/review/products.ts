import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { requireAdmin } from '../_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { only = 'all' } = req.query
    const base = supabaseAdmin.from('products').select('id,name,slug,approved,brand_id,price_label,created_at')
    const q = only === 'pending' ? base.eq('approved', false) : base
    const { data, error } = await q.order('created_at', { ascending: false }).limit(200)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ rows: data })
  }

  if (req.method === 'PATCH') {
    const { id, approved } = req.body as { id: string; approved?: boolean }
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const patch: any = {}
    if (approved !== undefined) patch.approved = approved
    const { error } = await supabaseAdmin.from('products').update(patch).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  res.setHeader('Allow', ['GET', 'PATCH'])
  res.status(405).end('Method Not Allowed')
}