import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthGuard } from '../../../lib/authGuard'
import { useEntitlements } from '../../../lib/useEntitlements'

export default function ProductsHarness() {
  const ready = useAuthGuard()
  const router = useRouter()
  const { data, loading } = useEntitlements()
  const [msg, setMsg] = useState<string | null>(null)

  if (!ready) return null

  async function callAdjust(action: 'decrement' | 'increment') {
    setMsg(null)
    const res = await fetch('/.netlify/functions/entitlements-adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (!res.ok) {
      const t = await res.text()
      setMsg(t || 'Failed')
      return
    }
    setMsg('OK')
    router.replace(router.asPath) // refresh page
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Products (test harness)</h1>

      {loading && <div>Loading…</div>}
      {data && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="mb-3">Available product slots: <b>{data.product_slots}</b></div>
          <div className="flex gap-2">
            <button
              onClick={() => callAdjust('decrement')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50"
              disabled={data.product_slots <= 0}
            >
              Use 1 slot (simulate publish)
            </button>
            <button
              onClick={() => callAdjust('increment')}
              className="px-3 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              Release 1 slot (simulate delete)
            </button>
          </div>
          {msg && <div className="mt-3 text-sm opacity-80">{msg}</div>}
        </div>
      )}
    </div>
  )
}
