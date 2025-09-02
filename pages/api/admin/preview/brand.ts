import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { requireAdmin } from '../_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  const id = String(req.query.id || '')
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('id,name,slug,approved,featured,logo_url,cover_url,category,description,website')
    .eq('id', id)
    .maybeSingle()
  if (error) return res.status(400).json({ error: error.message })
  return res.json({ row: data })
}