import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Join() {
  const r = useRouter()
  const next = (r.query.next as string) || '/onboarding'

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If already signed in, hop to next
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) r.replace(next)
    })()
  }, [r, next])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr(null); setInfo(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` }
        })
        if (error) throw error
        setInfo('Check your inbox to confirm your email. The link brings you back here automatically.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        r.replace(next)
      }
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>{mode === 'signup' ? 'Create account' : 'Sign in'} • HEMPIN</title></Head>
      <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#090b0d',color:'#eafff7',fontFamily:'ui-sans-serif,system-ui'}}>
        <form onSubmit={handleSubmit} style={{width:360,maxWidth:'92vw',padding:20,background:'rgba(20,24,24,.6)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16}}>
          <h1 style={{margin:'0 0 10px',fontSize:'1.4rem',fontWeight:800}}>
            {mode === 'signup' ? 'Create your HEMPIN account' : 'Welcome back'}
          </h1>

          <div style={{display:'grid',gap:10}}>
            <input
              type="email" required placeholder="Email"
              value={email} onChange={e=>setEmail(e.target.value)}
              style={input}
            />
            <input
              type="password" required placeholder="Password"
              value={password} onChange={e=>setPassword(e.target.value)}
              style={input}
            />
            <button type="submit" disabled={loading} style={btnPrimary}>
              {loading ? 'Please wait…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
            </button>
            <button type="button" onClick={()=>setMode(m=> m==='signup' ? 'signin' : 'signup')} style={btnGhost}>
              {mode === 'signup' ? 'I already have an account' : 'Create a new account'}
            </button>
          </div>

          {info && <p style={{marginTop:10,opacity:.9}}>{info}</p>}
          {err && <p style={{marginTop:10,color:'#ffd7d7'}}>{err}</p>}
        </form>
      </div>
    </>
  )
}

const input: React.CSSProperties = {
  padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)',
  background:'rgba(255,255,255,.02)', color:'#eafff7'
}
const btnPrimary: React.CSSProperties = {
  padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)',
  background:'linear-gradient(135deg,#1ee4a3,#26c6da)', color:'#07120f', fontWeight:800, cursor:'pointer'
}
const btnGhost: React.CSSProperties = {
  padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)',
  background:'transparent', color:'#d7ffef', fontWeight:700, cursor:'pointer'
}