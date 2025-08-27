// lib/paypal.ts
// PayPal Orders API helper (Node 18+ has global fetch)

const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;

function baseUrl() {
  return PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(baseUrl() + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization':
        'Basic ' + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  if (!res.ok) throw new Error('PayPal auth failed: ' + JSON.stringify(data));
  return (data as any).access_token;
}

export async function paypalCreateOrder(amountCents: number, currency = 'USD') {
  const token = await getAccessToken();
  const res = await fetch(baseUrl() + '/v2/checkout/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: (amountCents / 100).toFixed(2) } }],
      application_context: { user_action: 'PAY_NOW' },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error('PayPal create order failed: ' + JSON.stringify(data));
  return data; // includes id
}

export async function paypalCaptureOrder(orderID: string) {
  const token = await getAccessToken();
  const res = await fetch(baseUrl() + `/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error('PayPal capture failed: ' + JSON.stringify(data));
  return data;
}
