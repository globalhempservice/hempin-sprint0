import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { requireAdmin } from '../_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  const id = String(req.query.id || '')
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('id,title,slug,status,featured,summary,city,country,cover_url,starts_at,ends_at')
    .eq('id', id)
    .maybeSingle()
  if (error) return res.status(400).json({ error: error.message })
  return res.json({ row: data })
}