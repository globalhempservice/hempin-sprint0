// pages/admin/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const next = typeof router.query.next === 'string' ? router.query.next : '/admin'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      router.replace(next || '/admin')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login • HEMPIN</title></Head>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 flex items-center justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">H</div>
            <h1 className="text-lg font-semibold">Admin access</h1>
            <p className="text-xs text-zinc-400 mt-1">Enter the admin password</p>
          </div>
          <label className="block text-sm mb-2">Password</label>
          <input
            type="password"
            className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-emerald-500/80 hover:bg-emerald-500 px-3 py-2 font-medium"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">Back to site</Link>
          </div>
        </form>
      </div>
    </>
  )
}
