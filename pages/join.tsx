// pages/join.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import supaMaybe from '../lib/supabaseClient'
const supabase = (supaMaybe as any)?.supabase || supaMaybe

type Mode = 'signup' | 'signin'
type Stage = 'form' | 'check-email'

export default function Join() {
  const router = useRouter()
  const next = (router.query.next as string) || '/account/profile'
  const urlMode = (router.query.mode as string) || ''
  const defaultMode: Mode = useMemo(() => {
    if (urlMode === 'signup') return 'signup'
    if (urlMode === 'signin') return 'signin'
    if (next?.startsWith('/onboarding')) return 'signup'
    return 'signin'
  }, [urlMode, next])

  const [mode, setMode] = useState<Mode>(defaultMode)
  const [stage, setStage] = useState<Stage>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // If already signed in, bounce to next immediately
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).auth.getSession()
      if (data?.session?.user) router.replace(next)
    })()
  }, [router, next])

  // If the user clicks the email link and a session gets created,
  // this listener will fire and we can route them along.
  useEffect(() => {
    const { data: sub } = (supabase as any).auth.onAuthStateChange((_event: string, session: any) => {
      if (session?.user) router.replace(next)
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [router, next])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSubmitting(true)
    try {
      if (!email || !password) {
        setMsg('Please enter your email and password.')
        return
      }

      if (mode === 'signup') {
        // IMPORTANT: send users back to our callback with the intended `next`
        const emailRedirectTo =
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
            : undefined

        const { data, error } = await (supabase as any).auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        })

        if (error) {
          if (/already.*registered|exists/i.test(error.message)) {
            setMsg('This email already has an account. Try “Sign in” instead.')
            setMode('signin')
          } else {
            setMsg(error.message)
          }
          return
        }

        // If email confirmation is required, Supabase returns no session.
        // Show a friendly state so users know what to do.
        if (!data?.session) {
          setStage('check-email')
          return
        }

        // If confirmations are disabled and we do get a session, just continue.
        router.replace(next)
        return
      } else {
        const { data, error } = await (supabase as any).auth.signInWithPassword({ email, password })
        if (error) {
          if (/invalid|not.*found/i.test(error.message)) {
            setMsg('We couldn’t find that account. Try “Create account” instead.')
            setMode('signup')
          } else {
            setMsg(error.message)
          }
          return
        }
        if (data?.user) router.replace(next)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function resend() {
    setMsg(null)
    try {
      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
          : undefined

      const { error } = await (supabase as any).auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo },
      })
      if (error) setMsg(error.message)
      else setMsg('Email sent. Check your inbox.')
    } catch (e: any) {
      setMsg(e?.message || 'Could not resend.')
    }
  }

  return (
    <>
      <Head>
        <title>{mode === 'signup' ? 'Create account' : 'Sign in'} — HEMPIN</title>
      </Head>
      <style jsx>{`
        .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0d0f}
        .glass{background:rgba(20,20,24,.6);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08);border-radius:16px}
        .panel{width:min(92vw,460px);padding:22px}
        .h{font-size:1.6rem;font-weight:800;color:#eafff7}
        .muted{color:#a6d0c3}
        .row{display:flex;gap:.5rem;flex-wrap:wrap}
        .seg{display:flex;border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden}
        .seg button{padding:.5rem .9rem;background:transparent;color:#d7ffef;border:0}
        .seg .on{background:rgba(37,225,176,.18)}
        label{display:block;margin:.6rem 0 .3rem .1rem;color:#cfe9df}
        input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:.75rem 1rem;color:#eafff7}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,.12);cursor:pointer}
        .primary{background:linear-gradient(135deg,#1ee4a3,#26c6da);color:#0a0f0d;font-weight:800}
        .ghost{color:#d7ffef}
        .msg{margin-top:.6rem;color:#ffd7d7}
      `}</style>

      <div className="wrap">
        <div className="glass panel">
          {stage === 'form' ? (
            <>
              <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
                <div className="h">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</div>
                <div className="seg">
                  <button className={mode==='signin'?'on':''} onClick={()=>setMode('signin')}>Sign in</button>
                  <button className={mode==='signup'?'on':''} onClick={()=>setMode('signup')}>Create account</button>
                </div>
              </div>

              <p className="muted" style={{marginTop:6}}>
                You’ll be redirected to <span style={{color:'#eafff7'}}>{next}</span> after this.
              </p>

              <form onSubmit={handleSubmit} style={{marginTop:12}}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  autoComplete={mode==='signin'?'current-password':'new-password'}
                  required
                />

                {msg && <div className="msg">{msg}</div>}

                <div className="row" style={{marginTop:14, alignItems:'center', justifyContent:'space-between'}}>
                  <button disabled={submitting} className="btn primary" type="submit">
                    {submitting ? 'Working…' : (mode==='signup' ? 'Create account' : 'Sign in')}
                  </button>
                  <a className="btn ghost" href={`/signin?next=${encodeURIComponent(next)}`} style={{opacity:.85}}>
                    Legacy page
                  </a>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="h">Check your email ✉️</div>
              <p className="muted" style={{marginTop:8}}>
                We sent a secure sign-in link to <span style={{color:'#eafff7'}}>{email}</span>.  
                Open it on this device to continue to <span style={{color:'#eafff7'}}>{next}</span>.
              </p>
              {msg && <div className="msg">{msg}</div>}
              <div className="row" style={{marginTop:14}}>
                <button className="btn primary" onClick={resend}>Resend link</button>
                <button className="btn ghost" onClick={()=>setStage('form')}>Back</button>
              </div>
            </>
          )}

          <p className="muted" style={{marginTop:12,fontSize:'.9rem'}}>
            By continuing you agree to our{' '}
            <a href="/legal/privacy" style={{textDecoration:'underline'}}>Privacy</a> and{' '}
            <a href="/legal/terms" style={{textDecoration:'underline'}}>Terms</a>.
          </p>
        </div>
      </div>
    </>
  )
}