// netlify/functions/paypal-webhook.ts
import type { Handler } from '@netlify/functions'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

// NOTE: For real signature verification, use PayPal's 'verify-webhook-signature' endpoint.
// This is a stub scaffold; implement verification before going live.
export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
    const body = JSON.parse(event.body || '{}')
    const eventType = body.event_type

    if (eventType === 'CHECKOUT.ORDER.APPROVED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = body.resource?.id || body.resource?.supplementary_data?.related_ids?.order_id
      if (orderId) {
        await supabaseAdmin.from('orders').update({
          status: 'captured',
          captured_at: new Date().toISOString()
        }).eq('paypal_order_id', orderId)
        // NOTE: For full parity, also apply entitlements here like in capture-order.
      }
    }

    return { statusCode: 200, body: 'ok' }
  } catch (e: any) {
    return { statusCode: 500, body: e.message || 'Server error' }
  }
}
