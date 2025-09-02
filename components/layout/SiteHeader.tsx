// components/layout/SiteHeader.tsx
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Sesh = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

export default function SiteHeader() {
  const [session, setSession] = useState<Sesh | null>(null)
  const [open, setOpen] = useState(false)        // mobile drawer
  const [deskOpen, setDeskOpen] = useState(false) // desktop avatar dropdown
  const deskWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => mounted && setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => mounted && setSession(s))
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  // Close desktop dropdown on outside click / ESC
  useEffect(() => {
    if (!deskOpen) return
    const onClick = (e: MouseEvent) => {
      if (!deskWrapRef.current) return
      if (!deskWrapRef.current.contains(e.target as Node)) setDeskOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDeskOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [deskOpen])

  // simple avatar from metadata or initials
  const user = session?.user
  const avatarUrl = (user?.user_metadata as any)?.avatar_url as string | undefined
  const initials = (user?.email || 'U').slice(0, 1).toUpperCase()

  function close() { setOpen(false); setDeskOpen(false) }
  function toggleDrawer() { setOpen(v => !v) }
  function toggleDesk() { setDeskOpen(v => !v) }

  async function handleLogout() {
    await supabase.auth.signOut()
    close()
  }

  const ctaHref  = session ? '/account' : '/join?next=/onboarding'
  const ctaLabel = session ? 'Open account' : 'Join free'

  return (
    <header className="sh">
      <style jsx>{`
        .sh{position:relative}
        .bar{max-width:72rem;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:.5rem;text-decoration:none}
        .pill{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:.35rem .65rem;font-size:.75rem;opacity:.9}
        .foot{color:#8fbfb0}
        .links{display:flex;align-items:center;gap:14px}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem .9rem;border-radius:12px;border:1px solid rgba(255,255,255,.12)}
        .primary{background:linear-gradient(135deg,#1ee4a3,#26c6da);color:#06130f;font-weight:800}
        .ghost{color:#d7ffef}
        .burger{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;color:#cfe9df;background:transparent}
        .avatar{width:38px;height:38px;border-radius:999px;border:1px solid rgba(255,255,255,.12);overflow:hidden;display:grid;place-items:center;background:#18201e;color:#b6f3e1;font-weight:800}
        .deskOnly{display:flex}
        .mobOnly{display:none}
        @media (max-width: 780px){
          .deskOnly{display:none}
          .mobOnly{display:flex}
          .centerCTA{position:absolute;left:50%;transform:translateX(-50%)}
        }
        /* Drawer */
        .scrim{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .2s}
        .scrim.open{opacity:1;pointer-events:auto}
        .drawer{position:fixed;inset:auto 0 0 0;height:88vh;background:rgba(20,20,24,.96);border-top:1px solid rgba(255,255,255,.08);border-radius:18px 18px 0 0;transform:translateY(100%);transition:transform .24s}
        .drawer.open{transform:translateY(0)}
        .sect{padding:16px 18px;border-top:1px solid rgba(255,255,255,.06)}
        .title{font-weight:800;color:#eafff7;margin-bottom:8px}
        .link{display:block;padding:10px 0;color:#cfe9df}
        .row{display:flex;align-items:center;justify-content:space-between;gap:10px}
        /* Desktop avatar dropdown */
        .menuWrap{position:relative}
        .menu{position:absolute;right:0;top:46px;min-width:220px;background:rgba(20,20,24,.96);
          border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:8px;box-shadow:0 12px 36px rgba(0,0,0,.35);
          opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .14s, transform .14s}
        .menu.open{opacity:1;transform:translateY(0);pointer-events:auto}
        .mi{display:flex;align-items:center;justify-content:space-between;padding:10px 10px;border-radius:10px;color:#cfe9df}
        .mi:hover{background:rgba(255,255,255,.06)}
        .miTitle{font-weight:700;color:#eafff7}
        .sep{height:1px;background:rgba(255,255,255,.06);margin:6px 4px}
      `}</style>

      <div className="bar">
        {/* left: logo */}
        <Link href="/" className="logo" onClick={close}>
          <div className="pill">HEMPIN</div><span className="foot">ecosystem</span>
        </Link>

        {/* center (mobile): CTA */}
        <div className="mobOnly centerCTA">
          <Link href={ctaHref} className="btn primary">{ctaLabel}</Link>
        </div>

        {/* right: desktop links */}
        <nav className="links deskOnly">
          <Link href="/supermarket" className="btn ghost">Supermarket</Link>
          <Link href="/events" className="btn ghost">Events</Link>
          <Link href="/research" className="btn ghost">Research</Link>
          <Link href="/experiments" className="btn ghost">Experiments</Link>

          {session ? (
            <div className="menuWrap" ref={deskWrapRef}>
              <button className="avatar" onClick={toggleDesk} aria-label="Open account menu" aria-expanded={deskOpen}>
                {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
              </button>
              <div className={`menu ${deskOpen ? 'open' : ''}`} role="menu" aria-label="Account">
                <Link href="/account" className="mi" onClick={close}><span className="miTitle">Account home</span> ↗</Link>
                <Link href="/account/profile" className="mi" onClick={close}>Profile</Link>
                <Link href="/account/brand" className="mi" onClick={close}>My Brand</Link>
                <Link href="/account/products" className="mi" onClick={close}>My Products</Link>
                <div className="sep" />
                <div className="miTitle" style={{padding:'8px 10px 2px'}}>Universes</div>
                <Link href="/supermarket" className="mi" onClick={close}>Supermarket</Link>
                <Link href="/trade" className="mi" onClick={close}>Trade</Link>
                <Link href="/events" className="mi" onClick={close}>Events</Link>
                <Link href="/research" className="mi" onClick={close}>Research</Link>
                <Link href="/experiments" className="mi" onClick={close}>Experiments</Link>
                <div className="sep" />
                <button className="mi" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          ) : (
            <Link href="/join?next=/onboarding" className="btn primary">Join free</Link>
          )}
        </nav>

        {/* right: mobile burger or avatar */}
        <div className="mobOnly">
          {session ? (
            <button className="avatar" onClick={toggleDrawer} aria-label="Open menu" aria-expanded={open}>
              {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
            </button>
          ) : (
            <button className="burger" onClick={toggleDrawer} aria-label="Open menu" aria-expanded={open}>☰</button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
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
              <Link href="/account" className="link" onClick={close}>Account home</Link>
              <Link href="/account/profile" className="link" onClick={close}>Profile</Link>
              <Link href="/account/brand" className="link" onClick={close}>My Brand</Link>
              <Link href="/account/products" className="link" onClick={close}>My Products</Link>
            </div>
            <div className="sect">
              <div className="title">Universes</div>
              <Link href="/supermarket" className="link" onClick={close}>Supermarket</Link>
              <Link href="/trade" className="link" onClick={close}>Trade</Link>
              <Link href="/events" className="link" onClick={close}>Events</Link>
              <Link href="/research" className="link" onClick={close}>Research</Link>
              <Link href="/experiments" className="link" onClick={close}>Experiments</Link>
            </div>
            <div className="sect">
              <button className="btn ghost" onClick={handleLogout}>Log out</button>
            </div>
          </>
        ) : (
          <>
            <div className="sect">
              <div className="title">Welcome</div>
              <Link href="/join?next=/onboarding" className="btn primary" onClick={close}>Create account</Link>
              <div style={{height:8}}/>
              <Link href="/signin?next=/onboarding" className="btn ghost" onClick={close}>I already have an account</Link>
            </div>
            <div className="sect">
              <div className="title">Explore</div>
              <Link href="/supermarket" className="link" onClick={close}>Supermarket</Link>
              <Link href="/events" className="link" onClick={close}>Events</Link>
              <Link href="/research" className="link" onClick={close}>Research</Link>
              <Link href="/experiments" className="link" onClick={close}>Experiments</Link>
            </div>
          </>
        )}
      </aside>
    </header>
  )
}