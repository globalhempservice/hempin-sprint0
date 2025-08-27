// lib/paypal.ts
// Minimal helper for PayPal Orders API. Server-side use only.

import fetch from 'node-fetch'

const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox' // 'live' on prod
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!

function baseUrl() {
  return PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(baseUrl() + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: 'grant_type=client_credentials',
    // @ts-ignore
    auth: {
      user: PAYPAL_CLIENT_ID,
      pass: PAYPAL_SECRET
    }
  } as any)

  // node-fetch v2 doesn't support auth option; fallback to header
  if (res.status === 401) {
    const res2 = await fetch(baseUrl() + '/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    } as any)
    const data2 = await res2.json()
    if (!res2.ok) throw new Error('PayPal auth failed: ' + JSON.stringify(data2))
    return data2.access_token
  }

  const data = await res.json()
  if (!res.ok) throw new Error('PayPal auth failed: ' + JSON.stringify(data))
  return data.access_token
}

export async function paypalCreateOrder(amountUSD: number, currency='USD', returnUrl?: string) {
  const token = await getAccessToken()
  const res = await fetch(baseUrl() + '/v2/checkout/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: currency, value: (amountUSD/100).toFixed(2) }
      }],
      application_context: {
        user_action: 'PAY_NOW',
        return_url: returnUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8888'
      }
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error('PayPal create order failed: ' + JSON.stringify(data))
  return data // contains id and links
}

export async function paypalCaptureOrder(orderID: string) {
  const token = await getAccessToken()
  const res = await fetch(baseUrl() + `/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error('PayPal capture failed: ' + JSON.stringify(data))
  return data
}
