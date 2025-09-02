import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Sesh = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

export default function SiteHeader() {
  const [session, setSession] = useState<Sesh | null>(null)
  const [open, setOpen] = useState(false) // used for mobile drawer and desktop dropdown

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => { if (mounted) setSession(data.session) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (mounted) setSession(s) })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const user = session?.user
  const avatarUrl = (user?.user_metadata as any)?.avatar_url as string | undefined
  const initials  = (user?.email || 'U').slice(0,1).toUpperCase()

  const ctaHref  = session ? '/account' : '/join?next=/onboarding'
  const ctaLabel = session ? 'Open account' : 'Signup / Login'

  function close()  { setOpen(false) }
  function toggle() { setOpen(v => !v) }

  async function handleLogout() {
    await supabase.auth.signOut()
    close()
  }

  return (
    <header className="sh">
      <style jsx>{`
        .sh { position: relative; z-index: 60; }                 /* keep header above hero */
        .bar{ max-width:72rem; margin:0 auto; padding:12px 20px;
              display:flex; align-items:center; justify-content:space-between; }
        .logo{ display:flex; align-items:center; gap:.5rem; text-decoration:none }
        .pill{ border:1px solid rgba(255,255,255,.12); border-radius:999px;
               padding:.35rem .65rem; font-size:.75rem; opacity:.9 }
        .foot{ color:#8fbfb0 }
        .links{ display:flex; align-items:center; gap:14px }
        .btn{ display:inline-flex; align-items:center; gap:.5rem; padding:.6rem .9rem;
              border-radius:12px; border:1px solid rgba(255,255,255,.12) }
        .primary{ background:linear-gradient(135deg,#1ee4a3,#26c6da); color:#06130f; font-weight:800 }
        .ghost{ color:#d7ffef }
        .burger{ width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);
                 display:grid;place-items:center;color:#cfe9df;background:transparent }
        .avatar{ width:38px;height:38px;border-radius:999px;border:1px solid rgba(255,255,255,.12);
                 overflow:hidden;display:grid;place-items:center;background:#18201e;color:#b6f3e1;font-weight:800 }

        .deskOnly{ display:flex }
        .mobOnly{ display:none }
        @media (max-width: 780px){
          .deskOnly{ display:none }
          .mobOnly{ display:flex }
          .centerCTA{ position:absolute; left:50%; transform:translateX(-50%) }
        }

        /* --- Mobile drawer --- */
        .scrim{ position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(2px);
                opacity:0; pointer-events:none; transition:opacity .18s; z-index:50 }
        .scrim.open{ opacity:1; pointer-events:auto }
        .drawer{ position:fixed; inset:auto 0 0 0; height:88vh; background:rgba(20,20,24,.96);
                 border-top:1px solid rgba(255,255,255,.08); border-radius:18px 18px 0 0;
                 transform:translateY(100%); transition:transform .22s; z-index:55; }
        .drawer.open{ transform:translateY(0) }
        .sect{ padding:16px 18px; border-top:1px solid rgba(255,255,255,.06) }
        .title{ font-weight:800; color:#eafff7; margin-bottom:8px }
        .list{ display:flex; flex-direction:column; gap:10px }
        .link{ display:block; color:#cfe9df }
        .row{ display:flex; align-items:center; justify-content:space-between; gap:10px }

        /* --- Desktop dropdown panel --- */
        .panelWrap{ position:relative }                            /* anchor for absolute panel */
        .panel{ position:absolute; right:0; top:46px; width:320px;
                background:rgba(20,20,24,.96); border:1px solid rgba(255,255,255,.08);
                border-radius:14px; padding:12px; box-shadow:0 16px 40px rgba(0,0,0,.45); z-index:65 }
        .psect{ padding:10px 0; border-top:1px solid rgba(255,255,255,.06) }
        .psect:first-child{ border-top:0 }
        .plabel{ font-weight:800; color:#eafff7; margin:4px 0 8px }
        .plist{ display:flex; flex-direction:column; gap:8px }
      `}</style>

      <div className="bar">
        {/* left: logo */}
        <Link href="/" className="logo" onClick={close}>
          <div className="pill">HEMPIN</div><span className="foot">ecosystem</span>
        </Link>

        {/* center CTA on mobile */}
        <div className="mobOnly centerCTA">
          <Link href={ctaHref} className="btn primary">{ctaLabel}</Link>
        </div>

        {/* desktop links + auth control */}
        <nav className="links deskOnly">
          <Link href="/supermarket" className="btn ghost">Supermarket</Link>
          <Link href="/events" className="btn ghost">Events</Link>
          <Link href="/research" className="btn ghost">Research</Link>
          <Link href="/experiments" className="btn ghost">Experiments</Link>

          {session ? (
            <div className="panelWrap">
              <button className="avatar" onClick={toggle} aria-label="Open menu" aria-expanded={open}>
                {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
              </button>
              {open && (
                <div className="panel" role="menu">
                  <div className="psect">
                    <div className="plabel">Account</div>
                    <div className="plist">
                      <Link className="link" href="/account" onClick={close}>Account home</Link>
                      <Link className="link" href="/account/profile" onClick={close}>Profile</Link>
                      <Link className="link" href="/account/brand" onClick={close}>My Brand</Link>
                      <Link className="link" href="/account/products" onClick={close}>My Products</Link>
                    </div>
                  </div>
                  <div className="psect">
                    <div className="plabel">Universes</div>
                    <div className="plist">
                      <Link className="link" href="/supermarket" onClick={close}>Supermarket</Link>
                      <Link className="link" href="/trade" onClick={close}>Trade</Link>
                      <Link className="link" href="/events" onClick={close}>Events</Link>
                      <Link className="link" href="/research" onClick={close}>Research</Link>
                      <Link className="link" href="/experiments" onClick={close}>Experiments</Link>
                    </div>
                  </div>
                  <div className="psect">
                    <button className="btn ghost" onClick={handleLogout}>Log out</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/join?next=/onboarding" className="btn primary">Signup / Login</Link>
          )}
        </nav>

        {/* right: mobile burger or avatar */}
        <div className="mobOnly">
          {session ? (
            <button className="avatar" onClick={toggle} aria-label="Open menu" aria-expanded={open}>
              {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
            </button>
          ) : (
            <button className="burger" onClick={toggle} aria-label="Open menu" aria-expanded={open}>☰</button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`scrim ${open ? 'open' : ''}`} onClick={close}/>
      <aside className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="sect row">
          <div className="title">Menu</div>
          <button className="burger" onClick={close} aria-label="Close">✕</button>
        </div>

        {session ? (
          <>
            <div className="sect">
              <div className="title">Account</div>
              <div className="list">
                <Link className="link" href="/account" onClick={close}>Account home</Link>
                <Link className="link" href="/account/profile" onClick={close}>Profile</Link>
                <Link className="link" href="/account/brand" onClick={close}>My Brand</Link>
                <Link className="link" href="/account/products" onClick={close}>My Products</Link>
              </div>
            </div>
            <div className="sect">
              <div className="title">Universes</div>
              <div className="list">
                <Link className="link" href="/supermarket" onClick={close}>Supermarket</Link>
                <Link className="link" href="/trade" onClick={close}>Trade</Link>
                <Link className="link" href="/events" onClick={close}>Events</Link>
                <Link className="link" href="/research" onClick={close}>Research</Link>
                <Link className="link" href="/experiments" onClick={close}>Experiments</Link>
              </div>
            </div>
            <div className="sect">
              <button className="btn ghost" onClick={handleLogout}>Log out</button>
            </div>
          </>
        ) : (
          <>
            <div className="sect">
              <div className="title">Welcome</div>
              <div className="list">
                <Link href="/join?next=/onboarding" className="btn primary" onClick={close}>Signup / Login</Link>
                <Link href="/supermarket" className="btn ghost" onClick={close}>Explore the Supermarket</Link>
              </div>
            </div>
            <div className="sect">
              <div className="title">Universes</div>
              <div className="list">
                <Link className="link" href="/events" onClick={close}>Events</Link>
                <Link className="link" href="/research" onClick={close}>Research</Link>
                <Link className="link" href="/experiments" onClick={close}>Experiments</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </header>
  )
}