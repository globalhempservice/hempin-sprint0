// pages/admin/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const next = typeof router.query.next === 'string' ? router.query.next : '/admin'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const json = await r.json()
    setLoading(false)
    if (json.ok) {
      router.replace(next || '/admin')
    } else {
      setError(json.error || 'Login failed')
    }
  }

  return (
    <>
      <Head><title>Admin sign-in • HEMPIN</title></Head>
      <div className="min-h-screen grid place-items-center bg-black">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-xl backdrop-blur"
        >
          <div className="mb-5 text-center text-lg font-semibold text-white">Admin access</div>

          <label className="mb-2 block text-sm text-zinc-300">Admin password</label>
          <input
            type="password"
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-400/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <div className="mb-3 text-sm text-rose-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-emerald-400/30 px-3 py-2 text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
          <p className="mt-4 text-center text-xs text-zinc-400">
            This gate is separate from customer accounts.
          </p>
        </form>
      </div>
    </>
  )
}
