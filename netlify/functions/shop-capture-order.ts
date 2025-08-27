// netlify/functions/shop-capture-order.ts
import type { Handler } from '@netlify/functions'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { paypalCaptureOrder } from '../../lib/paypal'

/**
 * Apply entitlements based on purchased package codes.
 * This mirrors the mapping we use when creating orders.
 */
async function applyEntitlements(user_id: string, items: any[]) {
  let brandPage = false
  let productSlots = 0
  let popupBkk = false
  let popupExtras = 0

  for (const it of items || []) {
    const code = it.product_id
    const qty = Number(it.qty || 1)

    if (code === 'brand_page') brandPage = true
    if (code === 'product') productSlots += 1 * qty
    if (code === 'bundle_1b5p') { brandPage = true; productSlots += 5 * qty }
    if (code === 'popup_bkk_2025') { brandPage = true; productSlots += 5 * qty; popupBkk = true }
    if (code === 'popup_extra') { productSlots += 1 * qty; popupExtras += 1 * qty }
  }

  // Upsert into entitlements
  const { data } = await supabaseAdmin
    .from('entitlements')
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle()

  if (!data) {
    await supabaseAdmin.from('entitlements').insert({
      user_id,
      brand_page: brandPage,
      product_slots: productSlots,
      popup_bkk_2025: popupBkk,
      popup_extras: popupExtras,
    })
  } else {
    await supabaseAdmin
      .from('entitlements')
      .update({
        brand_page: data.brand_page || brandPage,
        product_slots: (data.product_slots || 0) + productSlots,
        popup_bkk_2025: data.popup_bkk_2025 || popupBkk,
        popup_extras: (data.popup_extras || 0) + popupExtras,
      })
      .eq('user_id', user_id)
  }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { orderID } = JSON.parse(event.body || '{}') as { orderID?: string }
    if (!orderID) return { statusCode: 400, body: 'Missing orderID' }

    // 1) Capture on PayPal
    const captureRes = await paypalCaptureOrder(orderID)
    // (Optional) validate captureRes.status === 'COMPLETED'

    // 2) Fetch the corresponding local order
    const { data: orderRow, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('paypal_order_id', orderID)
      .maybeSingle()

    if (fetchErr) {
      return { statusCode: 500, body: `DB read error: ${fetchErr.message}` }
    }

    if (!orderRow) {
      // We didn't find a matching local order. This should not happen if create-order succeeded.
      // Record a minimal row so we keep traceability, but we can't grant entitlements (no user_id).
      const { error: insertErr } = await supabaseAdmin.from('orders').insert({
        paypal_order_id: orderID,
        status: 'captured',
        currency: 'USD',
        total_cents: null,
        items: [],
        captured_at: new Date().toISOString(),
        meta: { note: 'Inserted by capture fallback: no matching created order found' },
      })
      if (insertErr) {
        return { statusCode: 500, body: `DB insert fallback error: ${insertErr.message}` }
      }
      // Safe success (no entitlements possible)
      return { statusCode: 200, body: JSON.stringify({ success: true, warning: 'order inserted without user_id' }) }
    }

    // 3) Mark captured
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'captured',
        captured_at: new Date().toISOString(),
        meta: { ...(orderRow.meta || {}), paypal_capture: captureRes },
      })
      .eq('paypal_order_id', orderID)

    if (updateErr) {
      return { statusCode: 500, body: `DB update error: ${updateErr.message}` }
    }

    // 4) Grant entitlements
    if (orderRow.user_id) {
      await applyEntitlements(orderRow.user_id, orderRow.items || [])
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Server error' }
  }
}
