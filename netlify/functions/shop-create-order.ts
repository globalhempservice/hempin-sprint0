// netlify/functions/shop-create-order.ts
import type { Handler } from '@netlify/functions'
import { priceFor, staticPriceUSD } from '../../lib/pricing'
import { paypalCreateOrder } from '../../lib/paypal'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

function todayParis(): string {
  const now = new Date()
  // naive: format YYYY-MM-DD in Europe/Paris; for scaffold it's okay
  const y = now.getFullYear()
  const m = String(now.getMonth()+1).padStart(2,'0')
  const d = String(now.getDate()).padStart(2,'0')
  return `${y}-${m}-${d}`
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
    const { user_id, items, returnUrl } = JSON.parse(event.body || '{}')
    if (!Array.isArray(items) || items.length === 0) return { statusCode: 400, body: 'No items' }

    const today = todayParis()
    let total = 0
    const normalized = items.map((it: any) => {
      const pid = it.product_id as string
      const qty = Number(it.qty || 1)
      const unit = pid === 'popup_bkk_2025' ? priceFor('popup_bkk_2025', today) : staticPriceUSD(pid as any)
      total += unit * qty
      return { product_id: pid, qty, unit_price_usd: unit }
    })

    const order = await paypalCreateOrder(total, 'USD', returnUrl)
    const paypal_order_id = order.id

    // Persist local order
    await supabaseAdmin.from('orders').insert({
      user_id,
      paypal_order_id,
      status: 'created',
      amount_usd: total,
      currency: 'USD',
      items: normalized
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: paypal_order_id, links: order.links })
    }
  } catch (e: any) {
    return { statusCode: 500, body: e.message || 'Server error' }
  }
}
