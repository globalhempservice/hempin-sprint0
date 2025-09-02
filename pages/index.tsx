// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Stat = { label: string; value: number }
type QuickStat = { brands: number; products: number; events: number }
type Sesh = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

export default function Home() {
  const [stats, setStats] = useState<QuickStat | null>(null)
  const [session, setSession] = useState<Sesh | null>(null)

  // Auth-aware CTA (lightweight; header also listens but it's fine)
  useEffect(() => {
    let mounted = true
  
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session)
    })
  
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(s)
    })
  
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Lazy fetch counts (fallback to pretty placeholders)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/meta/totals').then(res => res.json()).catch(() => null)
        if (r && typeof r.brands === 'number') setStats(r)
      } catch {}
    })()
  }, [])

  const heroStats: Stat[] = [
    { label: 'Brands',   value: stats?.brands ?? 56 },
    { label: 'Products', value: stats?.products ?? 128 },
    { label: 'Events',   value: stats?.events ?? 13 },
  ]

  const ctaHref   = session ? '/supermarket' : '/join?next=/onboarding'
  const ctaLabel  = session ? 'Open Supermarket' : 'Create your account'
  const showSignInHint = !session

  return (
    <>
      <Head>
        <title>HEMPIN — Build the hemp ecosystem</title>
        <meta
          name="description"
          content="HEMPIN is the glass-dark hub for hemp: trade, supermarket, events, research, and playful experiments."
        />
      </Head>

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            'radial-gradient(1200px 600px at 0% -10%, rgba(0,180,120,0.12), transparent 50%), radial-gradient(1200px 600px at 100% 110%, rgba(80,120,255,0.10), transparent 50%)'
        }}
      >
        {/* Subtle animated aurora + tiny utility CSS */}
        <style jsx>{`
          .aurora { position:absolute; inset:-20%;
            background: conic-gradient(from 180deg at 50% 50%, rgba(0,255,170,0.18), rgba(0,200,255,0.10), rgba(0,255,170,0.18));
            filter: blur(60px); opacity:.35; pointer-events:none; animation: swirl 18s linear infinite; }
          @keyframes swirl { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          .glass { background: rgba(20,20,24,.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
          .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.75rem 1rem; border-radius: 12px; border:1px solid rgba(255,255,255,.12); }
          .btn-primary { background: linear-gradient(135deg,#1ee4a3,#26c6da); color:#0a0f0d; font-weight: 700; }
          .btn-ghost { color:#d7ffef; background:transparent; }
          .btn-text { color:#9be9d3; text-decoration:underline; background:transparent; border:0; padding:0 .25rem; }
          .pill { border:1px solid rgba(255,255,255,.12); border-radius:999px; padding:.35rem .65rem; font-size:.75rem; opacity:.9 }
          .card { transition:transform .25s ease, box-shadow .25s ease; }
          .card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.35); }
          .grid { display:grid; gap:1rem; grid-template-columns: repeat(12,minmax(0,1fr)); }
          .h1 { font-size: clamp(2.2rem, 3.8vw, 3.6rem); line-height: 1.05; letter-spacing: -.02em; }
          .lead { color:#cfe9df; font-size: clamp(1rem, 1.6vw, 1.1rem) }
          .foot { color:#8fbfb0 }
        `}</style>

        <div className="aurora" />

        {/* HERO */}
        <main className="mx-auto max-w-6xl px-5 pb-24">
          <section className="glass card p-8 md:p-12 mt-4">
            <div className="grid items-center">
              <div style={{gridColumn: '1/-1'}}>
                <div className="pill" style={{display:'inline-flex', gap:'.4rem', alignItems:'center'}}>
                  <span>Glass • Dark • Playful</span> <span style={{opacity:.6}}>v0</span>
                </div>
                <h1 className="h1 mt-4" style={{color:'#ddfff4'}}>
                  Build the <span style={{color:'#25e1b0'}}>hemp multiverse</span> — trade, shop, learn, and grow.
                </h1>
                <p className="lead mt-4 max-w-2xl">
                  HEMPIN is a metaverse-ish ecosystem: modules for pros (trade, events, research)
                  and a delightful consumer supermarket. Earn leaves, unlock badges, and watch your
                  profile flourish 🌿.
                </p>

                {/* Auth-aware CTA row */}
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link href={ctaHref} className="btn btn-primary">{ctaLabel}</Link>
                  <Link href="/supermarket" className="btn btn-ghost">Explore the Supermarket</Link>
                  {showSignInHint && (
                    <Link href="/signin?next=/onboarding" className="btn btn-text">
                      Already have an account? Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid mt-8" style={{gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap:'1rem'}}>
              {heroStats.map(s => (
                <div key={s.label} className="glass p-4 text-center">
                  <div style={{fontSize:'1.6rem', fontWeight:800, color:'#eafff7'}}>{s.value}</div>
                  <div className="foot">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* UNIVERSE CARDS */}
          <section className="mt-12 grid" style={{gridTemplateColumns:'repeat(12,minmax(0,1fr))', gap:'1rem'}}>
            {[
              { k:'trade', title:'Trade', copy:'Supplier directory + RFQs with approvals & messaging.', href:'/trade' },
              { k:'supermarket', title:'Supermarket', copy:'Curated hemp goods. Shop brands, scan stories.', href:'/supermarket' },
              { k:'events', title:'Events', copy:'Create and feature hemp fairs. PayPal tickets built-in.', href:'/events' },
              { k:'research', title:'Research', copy:'Publish and surface hemp science. Collaborate.', href:'/research' },
              { k:'experiments', title:'Experiments', copy:'Playground for ideas and prototypes. Low-stakes magic.', href:'/experiments' },
            ].map(c => (
              <Link
                key={c.k}
                href={c.href}
                className="glass card p-5"
                style={{gridColumn:'span 6', minHeight:160, display:'flex', flexDirection:'column', justifyContent:'space-between'}}
              >
                <div>
                  <div className="pill">{c.title}</div>
                  <h3 style={{marginTop:'.6rem', color:'#e6fff6', fontWeight:800, fontSize:'1.2rem'}}>{c.title} Universe</h3>
                  <p className="foot" style={{marginTop:'.25rem'}}>{c.copy}</p>
                </div>
                <div className="foot" style={{opacity:.9}}>Enter →</div>
              </Link>
            ))}
          </section>

          {/* CTA strip */}
          <section className="glass p-6 mt-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="pill">New here?</div>
              <h4 style={{color:'#eafff7', fontWeight:800, fontSize:'1.1rem', marginTop:'.35rem'}}>
                Take the 60-second onboarding ritual
              </h4>
              <p className="foot">Tell us who you are (consumer or pro), pick your modules, earn your first badge.</p>
            </div>
            <Link href={ctaHref} className="btn btn-primary">
              {session ? 'Open Supermarket' : 'Begin onboarding'}
            </Link>
          </section>
        </main>

        <footer className="mx-auto max-w-6xl px-5 py-10">
          <div className="foot">HEMPIN 2025 — made with ❤️ for 🌍</div>
        </footer>
      </div>
    </>
  )
}