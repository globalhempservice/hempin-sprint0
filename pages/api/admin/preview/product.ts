import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { requireAdmin } from '../_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  const id = String(req.query.id || '')
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,approved,price_label,description,images')
    .eq('id', id)
    .maybeSingle()
  if (error) return res.status(400).json({ error: error.message })
  return res.json({ row: data })
}