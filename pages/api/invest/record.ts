// pages/api/invest/record.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabaseAdmin = createClient(url, serviceKey, { auth: { persistSession: false } })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { amount } = req.body || {}
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // In a real flow you'd verify the PayPal order here.
    // For now we simulate a captured contribution entry.
    const total_cents = Math.round(amount * 100)
    const paypal_order_id = `INVEST-SIM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`

    const { data: insert, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: null,                // (optional) you can wire the logged-in user id if you store it in req
        status: 'captured',
        total_cents,
        currency: 'USD',
        paypal_order_id,
      })
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ ok: true, id: insert?.id })
  } catch (e: any) {
    console.error('invest/record error', e?.message || e)
    return res.status(500).json({ message: 'Failed to record contribution' })
  }
}