import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side, bypasses RLS
)

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
  },
  body: typeof body === 'string' ? body : JSON.stringify(body),
})

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {})

  const method = event.httpMethod
  if (method !== 'GET' && method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  // we key configs by a human-friendly name (e.g. "supermarket", "events", etc.)
  const name = (event.queryStringParameters?.name || 'supermarket').toString()

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('universe_configs')
      .select('config')
      .eq('name', name)
      .maybeSingle()

    if (error) return json(500, { error: error.message })
    return json(200, data?.config ?? null)
  }

  // POST: upsert { name, config }
  try {
    const cfg = JSON.parse(event.body || '{}')

    const { error } = await supabase
      .from('universe_configs')
      .upsert({ name, config: cfg }, { onConflict: 'name' })

    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  } catch (e: any) {
    return json(400, { error: e?.message ?? 'Bad JSON' })
  }
}