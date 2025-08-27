// netlify/functions/entitlements-adjust.ts
import type { Handler } from '@netlify/functions'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

// Expect Authorization: Bearer <supabase access jwt>
// Body: { action: 'decrement' | 'increment' }
export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const auth = event.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) {
      return { statusCode: 401, body: 'Missing bearer token' }
    }

    // Decode JWT to get user id (sub)
    const decoded: any = jwt.decode(token)
    const userId = decoded?.sub
    if (!userId) {
      return { statusCode: 401, body: 'Invalid token' }
    }

    const body = event.body ? JSON.parse(event.body) : {}
    const action: 'decrement'|'increment' = body.action

    if (!['decrement','increment'].includes(action)) {
      return { statusCode: 400, body: 'Bad action' }
    }

    // Upsert row if missing
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('entitlements')
      .select('product_slots')
      .eq('user_id', userId)
      .maybeSingle()
    if (selErr) throw selErr

    let current = existing?.product_slots ?? 0
    let next = action === 'decrement' ? Math.max(0, current - 1) : current + 1

    const { data, error } = await supabaseAdmin
      .from('entitlements')
      .upsert({ user_id: userId, product_slots: next }, { onConflict: 'user_id' })
      .select('brand_page,product_slots,popup_bkk_2025,popup_extras')
      .single()

    if (error) throw error

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, entitlements: data }),
      headers: { 'content-type': 'application/json' }
    }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Server error' }
  }
}
