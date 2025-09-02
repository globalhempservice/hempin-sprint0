// pages/api/admin/dashboard.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { requireAdmin } from './_utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return

  try {
    const [brandsTotal, brandsApproved, eventsTotal, eventsApproved, productsApproved, usersTotal, ordersTotal] =
      await Promise.all([
        supabaseAdmin.from('brands').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('brands').select('id', { count: 'exact', head: true }).eq('approved', true),
        supabaseAdmin.from('events').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('events').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('approved', true),
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }), // if you have it
      ])

    const recentBrands = await supabaseAdmin
      .from('brands')
      .select('id,name,slug,approved,created_at,logo_url,category')
      .order('created_at', { ascending: false })
      .limit(6)

    const recentEvents = await supabaseAdmin
      .from('events')
      .select('id,title,slug,status,created_at,city,country')
      .order('created_at', { ascending: false })
      .limit(6)

    res.json({
      stats: {
        brandsPending: (brandsTotal.count ?? 0) - (brandsApproved.count ?? 0),
        brandsApproved: brandsApproved.count ?? 0,
        eventsPending: (eventsTotal.count ?? 0) - (eventsApproved.count ?? 0),
        eventsApproved: eventsApproved.count ?? 0,
        productsApproved: productsApproved.count ?? 0,
        usersTotal: usersTotal.count ?? 0,
        ordersTotal: ordersTotal.count ?? 0,
      },
      recentBrands: recentBrands.data ?? [],
      recentEvents: recentEvents.data ?? [],
    })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' })
  }
}