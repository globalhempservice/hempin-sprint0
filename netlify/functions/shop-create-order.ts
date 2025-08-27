// netlify/functions/shop-create-order.ts
import type { Handler } from '@netlify/functions'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { paypalCreateOrder } from '../../lib/paypal'
import { todayParis, priceFromRules } from '../../lib/pricing'

type Body = {
  user_id: string
  items: { code: string, qty?: number }[]
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
    const body = JSON.parse(event.body || '{}') as Body
    if (!body.user_id) return { statusCode: 400, body: 'Missing user_id' }
    if (!Array.isArray(body.items) || body.items.length === 0) return { statusCode: 400, body: 'No items' }

    const codes = body.items.map(i => i.code)
    const { data: pkgs, error } = await supabaseAdmin
      .from('packages')
      .select('code,title,base_price_cents,meta')
      .in('code', codes)
    if (error) throw error

    const today = todayParis()
    let total = 0
    const normalized:any[] = []

    for (const it of body.items) {
      const pkg = pkgs?.find(p => p.code === it.code)
      if (!pkg) throw new Error(`Package not found: ${it.code}`)
      const qty = Number(it.qty || 1)
      const rules = (pkg.meta && pkg.meta.date_rules) ? pkg.meta.date_rules : null
      const priced = priceFromRules(pkg.base_price_cents, rules, today)
      total += priced.price_cents * qty
      normalized.push({ product_id: pkg.code, qty, unit_price_usd: priced.price_cents })
    }

    const order = await paypalCreateOrder(total, 'USD')
    const paypal_order_id = order.id

   const { error: insertErr } = await supabaseAdmin.from('orders').insert({
  user_id: body.user_id,
  paypal_order_id,
  status: 'created',
  total_cents: total,
  currency: 'USD',
  items: normalized
});
if (insertErr) throw insertErr;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: paypal_order_id })
    }
  } catch (e:any) {
    return { statusCode: 500, body: e.message || 'Server error' }
  }
}
