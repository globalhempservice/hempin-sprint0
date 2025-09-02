// components/layout/SiteHeader.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

type Sesh = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

export default function SiteHeader() {
  const [session, setSession] = useState<Sesh | null>(null)
  const [open, setOpen] = useState(false)
  const r = useRouter()

  // keep auth state in sync
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => mounted && setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(s)
    })
    // close drawer on route changes
    const close = () => setOpen(false)
    r.events.on('routeChangeStart', close)
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
      r.events.off('routeChangeStart', close)
    }
  }, [r.events])

  const user = session?.user
  const avatarUrl = (user?.user_metadata as any)?.avatar_url as string | undefined
  const initials = (user?.email || 'U').slice(0, 1).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    setOpen(false)
  }

  const ctaHref  = session ? '/account' : '/join?next=/onboarding'
  const ctaLabel = session ? 'Account' : 'Signup / Login'

  return (
    <header className="sh">
      <style jsx>{`
        .sh{position:relative; z-index:40;}
        .bar{max-width:72rem;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:.5rem;text-decoration:none}
        .pill{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:.35rem .65rem;font-size:.75rem;opacity:.9}
        .foot{color:#8fbfb0}
        .links{display:flex;align-items:center;gap:14px}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem .9rem;border-radius:12px;border:1px solid rgba(255,255,255,.12)}
        .ghost{color:#d7ffef;background:transparent}
        .cta{background:#6f61ff;color:#0a0d11;font-weight:800;border-color:transparent}
        .burger{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;color:#cfe9df;background:transparent}
        .avatar{width:38px;height:38px;border-radius:999px;border:1px solid rgba(255,255,255,.12);overflow:hidden;display:grid;place-items:center;background:#18201e;color:#b6f3e1;font-weight:800}
        .deskOnly{display:flex}
        .mobOnly{display:none}
        @media (max-width: 780px){
          .deskOnly{display:none}
          .mobOnly{display:flex}
          .centerCTA{position:absolute;left:50%;transform:translateX(-50%)}
        }
        /* Overlay + drawer/panel */
        .scrim{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .2s; z-index:60;}
        .scrim.open{opacity:1;pointer-events:auto}
        .drawer{position:fixed;left:0;right:0;bottom:0;height:88vh;background:rgba(20,20,24,.96);border-top:1px solid rgba(255,255,255,.08);border-radius:18px 18px 0 0;transform:translateY(100%);transition:transform .24s; z-index:61;}
        .drawer.open{transform:translateY(0)}
        .sect{padding:16px 18px;border-top:1px solid rgba(255,255,255,.06)}
        .title{font-weight:800;color:#eafff7;margin-bottom:8px}
        .link{display:block;padding:10px 0;color:#cfe9df}
        .row{display:flex;align-items:center;justify-content:space-between;gap:10px}
        /* Desktop small panel for avatar */
        .panel{position:absolute;right:0;top:46px;min-width:220px;background:rgba(20,20,24,.96);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px; z-index:61; box-shadow:0 12px 40px rgba(0,0,0,.35)}
      `}</style>

      <div className="bar">
        {/* Left: logo */}
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <div className="pill">HEMPIN</div><span className="foot">ecosystem</span>
        </Link>

        {/* Center CTA (mobile only, hidden if logged in) */}
        {!session && (
          <div className="mobOnly centerCTA">
            <Link href="/join?next=/onboarding" className="btn cta">Signup / Login</Link>
          </div>
        )}

        {/* Right: desktop links */}
        <nav className="links deskOnly">
          <Link href="/supermarket" className="btn ghost">Supermarket</Link>
          <Link href="/events" className="btn ghost">Events</Link>
          <Link href="/research" className="btn ghost">Research</Link>
          <Link href="/experiments" className="btn ghost">Experiments</Link>

          {session ? (
            <div style={{position:'relative'}}>
              <button className="avatar" onClick={() => setOpen(v=>!v)} aria-label="Open menu" aria-expanded={open}>
                {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
              </button>

              {/* desktop panel */}
              {open && (
                <div className="panel" role="menu" aria-label="Account menu">
                  <Link href="/account" className="link" onClick={() => setOpen(false)}>Account home</Link>
                  <Link href="/account/profile" className="link" onClick={() => setOpen(false)}>Profile</Link>
                  <Link href="/account/brand" className="link" onClick={() => setOpen(false)}>My Brand</Link>
                  <Link href="/account/products" className="link" onClick={() => setOpen(false)}>My Products</Link>
                  <div className="sect" style={{padding:0, borderTop:'none'}}>
                    <button className="btn ghost" onClick={handleLogout} style={{width:'100%'}}>Log out</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href={ctaHref} className="btn cta">Signup / Login</Link>
          )}
        </nav>

        {/* Right: mobile burger or avatar */}
        <div className="mobOnly">
          {session ? (
            <button className="avatar" onClick={() => setOpen(v=>!v)} aria-label="Open menu" aria-expanded={open}>
              {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
            </button>
          ) : (
            <button className="burger" onClick={() => setOpen(v=>!v)} aria-label="Open menu" aria-expanded={open}>☰</button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)}/>
      <aside className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="sect row">
          <div className="title">Menu</div>
          <button className="burger" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        {session ? (
          <>
            <div className="sect">
              <div className="title">Account</div>
              <Link href="/account" className="link" onClick={() => setOpen(false)}>Account home</Link>
              <Link href="/account/profile" className="link" onClick={() => setOpen(false)}>Profile</Link>
              <Link href="/account/brand" className="link" onClick={() => setOpen(false)}>My Brand</Link>
              <Link href="/account/products" className="link" onClick={() => setOpen(false)}>My Products</Link>
            </div>
            <div className="sect">
              <div className="title">Universes</div>
              <Link href="/supermarket" className="link" onClick={() => setOpen(false)}>Supermarket</Link>
              <Link href="/trade" className="link" onClick={() => setOpen(false)}>Trade</Link>
              <Link href="/events" className="link" onClick={() => setOpen(false)}>Events</Link>
              <Link href="/research" className="link" onClick={() => setOpen(false)}>Research</Link>
              <Link href="/experiments" className="link" onClick={() => setOpen(false)}>Experiments</Link>
            </div>
            <div className="sect">
              <button className="btn ghost" onClick={handleLogout}>Log out</button>
            </div>
          </>
        ) : (
          <>
            <div className="sect">
              <div className="title">Welcome</div>
              <Link href="/join?next=/onboarding" className="btn cta" onClick={() => setOpen(false)}>Signup / Login</Link>
              <div style={{height:8}}/>
              <Link href="/supermarket" className="btn ghost" onClick={() => setOpen(false)}>Explore the Supermarket</Link>
            </div>
            <div className="sect">
              <div className="title">Explore</div>
              <Link href="/events" className="link" onClick={() => setOpen(false)}>Events</Link>
              <Link href="/research" className="link" onClick={() => setOpen(false)}>Research</Link>
              <Link href="/experiments" className="link" onClick={() => setOpen(false)}>Experiments</Link>
            </div>
          </>
        )}
      </aside>
    </header>
  )
}