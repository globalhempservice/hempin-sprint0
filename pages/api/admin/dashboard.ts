// pages/api/admin/dashboard.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { requireAdmin } from './_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  // Counts
  const [{ count: brands_pending }, { count: events_pending }, { count: products_pending }] =
    await Promise.all([
      supabaseAdmin.from('brands').select('id', { count: 'exact', head: true }).eq('approved', false),
      supabaseAdmin.from('events').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('approved', false),
    ])

  const [{ count: brands_approved }, { count: events_approved }, { count: products_approved }] =
    await Promise.all([
      supabaseAdmin.from('brands').select('id', { count: 'exact', head: true }).eq('approved', true),
      supabaseAdmin.from('events').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('approved', true),
    ])

  // Recent items (approved or pending, newest first)
  const [recentBrands, recentEvents, recentProducts] = await Promise.all([
    supabaseAdmin
      .from('brands')
      .select('id,name,slug,approved')
      .order('created_at', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('events')
      .select('id,title,slug,status')
      .order('created_at', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('products')
      .select('id,name,slug,approved,price_label')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  res.json({
    pending: {
      brands: brands_pending ?? 0,
      events: events_pending ?? 0,
      products: products_pending ?? 0,
    },
    approved: {
      brands: brands_approved ?? 0,
      events: events_approved ?? 0,
      products: products_approved ?? 0,
    },
    recent: {
      brands: recentBrands.data ?? [],
      events: recentEvents.data ?? [],
      products: recentProducts.data ?? [],
    },
  })
}