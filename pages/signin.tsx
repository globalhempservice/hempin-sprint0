// pages/signin.tsx
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function SignIn() {
  const router = useRouter()
  const next = typeof router.query.next === 'string' ? router.query.next : '/account'

  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already signed in, bounce
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next || '/account')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setMessage(null)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace(next || '/account')
        return
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // If you keep email confirmation off in Supabase Auth settings,
            // the session will exist right away.
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/account`
          }
        })
        if (error) throw error

        if (data.session) {
          // Confirmation disabled -> user is signed in
          router.replace(next || '/account')
        } else {
          // Confirmation enabled -> ask user to check email
          setMessage('Check your email to confirm your account, then come back!')
        }
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Head><title>Sign in • HEMPIN</title></Head>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur">
        <div className="mb-5 flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${mode==='signin' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setMode('signin')}
          >Sign in</button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm ${mode==='signup' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setMode('signup')}
          >Create account</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm opacity-70 mb-1">Email</label>
            <input className="w-full rounded-xl bg-white/5 px-3 py-2 outline-none"
              type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm opacity-70 mb-1">Password</label>
            <input className="w-full rounded-xl bg-white/5 px-3 py-2 outline-none"
              type="password" required value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {message && <div className="text-emerald-400 text-sm">{message}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Please wait…' : (mode === 'signin' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm opacity-70">
          <a href="/" className="hover:underline">Back to homepage</a>
        </div>
      </div>
    </div>
  )
}