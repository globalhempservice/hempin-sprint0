// pages/account/products/index.tsx
import { useEffect, useState } from 'react'
import AppShell from '../../../components/AppShell'
import { supabase } from '../../../lib/supabaseClient'

export default function ProductsHarness() {
  const [slots, setSlots] = useState<number | null>(null)
  const [msg, setMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMsg('Please sign in.')
        return
      }
      const { data, error } = await supabase
        .from('entitlements')
        .select('product_slots')
        .eq('user_id', user.id)
        .maybeSingle()
      if (error) setMsg(error.message)
      setSlots((data as any)?.product_slots ?? 0)
    })()
  }, [])

  async function adjust(action: 'decrement' | 'increment') {
    setMsg('')
    setLoading(true)
    try {
      const { data: session } = await supabase.auth.getSession()
      const access = session.session?.access_token
      const res = await fetch('/.netlify/functions/entitlements-adjust', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        } as any,
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const text = await res.text()
        setMsg(text || 'Request failed')
        return
      }
      const json = await res.json()
      setSlots(json?.entitlements?.product_slots ?? 0)
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Products (test harness)</h1>
        <div className="border border-neutral-800 rounded p-4">
          <p className="mb-3">
            Available product slots:{' '}
            <span className="font-semibold">{slots ?? '—'}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => adjust('decrement')}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded px-3 py-1"
            >
              Use 1 slot (simulate publish)
            </button>
            <button
              onClick={() => adjust('increment')}
              disabled={loading}
              className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-60 rounded px-3 py-1"
            >
              Release 1 slot (simulate delete)
            </button>
          </div>

          {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
        </div>
      </div>
    </AppShell>
  )
}
