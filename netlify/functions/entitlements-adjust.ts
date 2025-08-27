// netlify/functions/entitlements-adjust.ts
import type { Handler } from '@netlify/functions'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

// Body: { action: 'decrement' | 'increment' }
export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { action } = JSON.parse(event.body || '{}') as { action?: 'decrement' | 'increment' }
    if (!action) return { statusCode: 400, body: 'Missing action' }

    // get user from Supabase auth cookie/JWT (Netlify → pass cookie header through to us)
    const accessToken = event.headers['authorization']?.replace('Bearer ', '') ||
                        event.headers['cookie'] || ''
    const { data: { user }, error: uErr } = await supabaseAdmin.auth.getUser(accessToken as any)
    if (uErr || !user) return { statusCode: 401, body: 'Unauthorized' }

    // Ensure entitlements row exists
    await supabaseAdmin
      .from('entitlements')
      .upsert({ user_id: user.id }, { onConflict: 'user_id' })

    if (action === 'decrement') {
      // only decrement if > 0
      const { data: row, error: rErr } = await supabaseAdmin
        .from('entitlements')
        .select('product_slots')
        .eq('user_id', user.id)
        .maybeSingle()
      if (rErr) throw rErr
      const slots = (row?.product_slots ?? 0)
      if (slots <= 0) return { statusCode: 400, body: 'No available product slots' }

      const { error: dErr } = await supabaseAdmin.rpc('noop') // placeholder to keep types happy
      // direct update:
      const { error: upErr } = await supabaseAdmin
        .from('entitlements')
        .update({ product_slots: slots - 1, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
      if (upErr) throw upErr
      return { statusCode: 200, body: JSON.stringify({ ok: true, product_slots: slots - 1 }) }
    }

    if (action === 'increment') {
      const { data: row, error: rErr } = await supabaseAdmin
        .from('entitlements')
        .select('product_slots')
        .eq('user_id', user.id)
        .maybeSingle()
      if (rErr) throw rErr
      const slots = (row?.product_slots ?? 0)
      const { error: upErr } = await supabaseAdmin
        .from('entitlements')
        .update({ product_slots: slots + 1, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
      if (upErr) throw upErr
      return { statusCode: 200, body: JSON.stringify({ ok: true, product_slots: slots + 1 }) }
    }

    return { statusCode: 400, body: 'Unknown action' }
  } catch (e: any) {
    console.error(e)
    return { statusCode: 500, body: e?.message || 'Server error' }
  }
}
