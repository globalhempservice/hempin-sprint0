import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Sesh = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

export default function SiteHeader() {
  const [session, setSession] = useState<Sesh | null>(null)
  const [open, setOpen] = useState(false)         // mobile drawer
  const [menuOpen, setMenuOpen] = useState(false) // desktop avatar popover

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => { if (mounted) setSession(data.session) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (mounted) setSession(s) })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const user = session?.user
  const avatarUrl = (user?.user_metadata as any)?.avatar_url as string | undefined
  const initials = (user?.email || 'U').slice(0, 1).toUpperCase()

  const ctaHref  = '/join?next=/onboarding'
  const ctaLabel = 'Free signup'

  async function handleLogout() {
    await supabase.auth.signOut()
    setMenuOpen(false)
    setOpen(false)
  }

  function closeAll() {
    setOpen(false)
    setMenuOpen(false)
  }

  return (
    <header className="sh">
      <style jsx>{`
        .sh{
          position:sticky; top:0; z-index:70;
          background: rgba(10,12,14,.65);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .bar{max-width:72rem;margin:0 auto;padding:12px 20px;
             display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:.5rem;text-decoration:none}
        .pill{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:.35rem .65rem;font-size:.75rem;opacity:.9}
        .foot{color:#8fbfb0}
        .links{display:flex;align-items:center;gap:14px}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem .9rem;border-radius:12px;border:1px solid rgba(255,255,255,.12)}
        /* purple CTA (same vibe as hero) */
        .primary{background: linear-gradient(135deg,#7c5cff,#b08bff); color:#0b0f12; font-weight:800}
        .ghost{color:#d7ffef; background:transparent}
        .burger{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;color:#cfe9df;background:transparent}
        .avatar{width:38px;height:38px;border-radius:999px;border:1px solid rgba(255,255,255,.12);overflow:hidden;display:grid;place-items:center;background:#18201e;color:#b6f3e1;font-weight:800}
        .deskOnly{display:flex}
        .mobOnly{display:none}
        @media (max-width: 780px){
          .deskOnly{display:none}
          .mobOnly{display:flex}
          .centerCTA{position:absolute;left:50%;transform:translateX(-50%)}
        }
        /* Desktop popover */
        .popoverWrap{position:relative}
        .popover{
          position:absolute; right:0; top:48px;
          min-width:220px; z-index:80;
          background: rgba(20,20,24,.98);
          border:1px solid rgba(255,255,255,.08);
          border-radius:12px; padding:8px;
          box-shadow: 0 20px 60px rgba(0,0,0,.45);
        }
        .item{display:block;padding:10px 12px;color:#d7ffef;border-radius:8px}
        .item:hover{background:rgba(255,255,255,.06)}
        .sep{height:1px;background:rgba(255,255,255,.06);margin:6px 0}
        /* Drawer */
        .scrim{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);
               opacity:0;pointer-events:none;transition:opacity .2s; z-index:75}
        .scrim.open{opacity:1;pointer-events:auto}
        .drawer{position:fixed;inset:auto 0 0 0;height:88vh;
                background:rgba(20,20,24,.96);
                border-top:1px solid rgba(255,255,255,.08);
                border-radius:18px 18px 0 0;transform:translateY(100%);
                transition:transform .24s; z-index:76}
        .drawer.open{transform:translateY(0)}
        .sect{padding:16px 18px;border-top:1px solid rgba(255,255,255,.06)}
        .title{font-weight:800;color:#eafff7;margin-bottom:8px}
        .link{display:block;padding:10px 0;color:#cfe9df}
        .row{display:flex;align-items:center;justify-content:space-between;gap:10px}
      `}</style>

      <div className="bar">
        {/* left: logo */}
        <Link href="/" className="logo" onClick={closeAll}>
          <div className="pill">HEMPIN</div><span className="foot">ecosystem</span>
        </Link>

        {/* center (mobile): CTA only when logged OUT */}
        {!session && (
          <div className="mobOnly centerCTA">
            <Link href={ctaHref} className="btn primary">{ctaLabel}</Link>
          </div>
        )}

        {/* right: desktop links */}
        <nav className="links deskOnly">
          <Link href="/supermarket" className="btn ghost">Supermarket</Link>
          <Link href="/events" className="btn ghost">Events</Link>
          <Link href="/research" className="btn ghost">Research</Link>
          <Link href="/experiments" className="btn ghost">Experiments</Link>

          {session ? (
            <div className="popoverWrap">
              <button className="avatar" onClick={() => setMenuOpen(v => !v)} aria-label="Open menu" aria-expanded={menuOpen}>
                {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
              </button>
              {menuOpen && (
                <div className="popover" role="menu" aria-label="Account menu">
                  <Link href="/account" className="item" onClick={closeAll}>Account home ↗</Link>
                  <div className="sep"/>
                  <Link href="/account/profile" className="item" onClick={closeAll}>Profile</Link>
                  <Link href="/account/brand" className="item" onClick={closeAll}>My Brand</Link>
                  <Link href="/account/products" className="item" onClick={closeAll}>My Products</Link>
                  <div className="sep"/>
                  <button className="item" onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href={ctaHref} className="btn primary">Free signup</Link>
          )}
        </nav>

        {/* right: mobile burger or avatar */}
        <div className="mobOnly">
          {session ? (
            <button className="avatar" onClick={() => setOpen(v => !v)} aria-label="Open menu" aria-expanded={open}>
              {avatarUrl ? <img src={avatarUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
            </button>
          ) : (
            <button className="burger" onClick={() => setOpen(v => !v)} aria-label="Open menu" aria-expanded={open}>☰</button>
          )}
        </div>
      </div>

      {/* Mobile drawer & scrim */}
      <div className={`scrim ${open ? 'open' : ''}`} onClick={closeAll}/>
      <aside className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="sect row">
          <div className="title">Menu</div>
          <button className="burger" onClick={closeAll} aria-label="Close">✕</button>
        </div>

        {session ? (
          <>
            <div className="sect">
              <div className="title">Account</div>
              <Link href="/account" className="link" onClick={closeAll}>Account home</Link>
              <Link href="/account/profile" className="link" onClick={closeAll}>Profile</Link>
              <Link href="/account/brand" className="link" onClick={closeAll}>My Brand</Link>
              <Link href="/account/products" className="link" onClick={closeAll}>My Products</Link>
            </div>
            <div className="sect">
              <div className="title">Universes</div>
              <Link href="/supermarket" className="link" onClick={closeAll}>Supermarket</Link>
              <Link href="/trade" className="link" onClick={closeAll}>Trade</Link>
              <Link href="/events" className="link" onClick={closeAll}>Events</Link>
              <Link href="/research" className="link" onClick={closeAll}>Research</Link>
              <Link href="/experiments" className="link" onClick={closeAll}>Experiments</Link>
            </div>
            <div className="sect">
              <button className="btn ghost" onClick={handleLogout}>Log out</button>
            </div>
          </>
        ) : (
          <>
            <div className="sect">
              <div className="title">Welcome</div>
              <Link href="/join?next=/onboarding" className="btn primary" onClick={closeAll}>Free signup</Link>
              <div style={{height:8}}/>
              <Link href="/signin?next=/onboarding" className="btn ghost" onClick={closeAll}>I already have an account</Link>
            </div>
            <div className="sect">
              <div className="title">Explore</div>
              <Link href="/supermarket" className="link" onClick={closeAll}>Supermarket</Link>
              <Link href="/events" className="link" onClick={closeAll}>Events</Link>
              <Link href="/research" className="link" onClick={closeAll}>Research</Link>
              <Link href="/experiments" className="link" onClick={closeAll}>Experiments</Link>
            </div>
          </>
        )}
      </aside>
    </header>
  )
}