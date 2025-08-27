// netlify/functions/shop-capture-order.ts
import type { Handler } from '@netlify/functions'
import { paypalCaptureOrder } from '../../lib/paypal'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

async function applyEntitlements(user_id: string, items: any[]) {
  // Compute deltas
  let brandPage = false
  let productSlots = 0
  let popupBkk = false
  let popupExtras = 0

  for (const it of items) {
    const pid = it.product_id
    const qty = Number(it.qty || 1)
    if (pid === 'brand_page') brandPage = true
    if (pid === 'product') productSlots += 1 * qty
    if (pid === 'bundle_1b5p') { brandPage = true; productSlots += 5 * qty }
    if (pid === 'popup_bkk_2025') { brandPage = true; productSlots += 5 * qty; popupBkk = true }
    if (pid === 'popup_extra') { productSlots += 1 * qty; popupExtras += 1 * qty }
  }

  // Upsert entitlements
  const { data } = await supabaseAdmin.from('entitlements').select('*').eq('user_id', user_id).maybeSingle()
  if (!data) {
    await supabaseAdmin.from('entitlements').insert({
      user_id,
      brand_page: brandPage,
      product_slots: productSlots,
      popup_bkk_2025: popupBkk,
      popup_extras: popupExtras
    })
  } else {
    await supabaseAdmin.from('entitlements').update({
      brand_page: data.brand_page || brandPage,
      product_slots: (data.product_slots || 0) + productSlots,
      popup_bkk_2025: data.popup_bkk_2025 || popupBkk,
      popup_extras: (data.popup_extras || 0) + popupExtras
    }).eq('user_id', user_id)
  }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
    const { orderID } = JSON.parse(event.body || '{}')
    if (!orderID) return { statusCode: 400, body: 'Missing orderID' }

    const cap = await paypalCaptureOrder(orderID)
    // Extract buyer and items from our local order
    const { data: orderRow } = await supabaseAdmin.from('orders').select('*').eq('paypal_order_id', orderID).maybeSingle()
    if (!orderRow) return { statusCode: 404, body: 'Order not found' }

    await supabaseAdmin.from('orders').update({
      status: 'captured',
      captured_at: new Date().toISOString()
    }).eq('paypal_order_id', orderID)

    if (orderRow.user_id) {
      await applyEntitlements(orderRow.user_id, orderRow.items || [])
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    }
  } catch (e: any) {
    return { statusCode: 500, body: e.message || 'Server error' }
  }
}
