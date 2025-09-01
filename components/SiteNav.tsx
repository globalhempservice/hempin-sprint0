// components/SiteNav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type SessionLike = {
  user: { email?: string | null; user_metadata?: Record<string, any> } | null
} | null

export default function SiteNav() {
  const router = useRouter()
  const [session, setSession] = useState<SessionLike>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session ?? null)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null)
    })
    return () => {
      mounted = false
      sub.subscription?.unsubscribe?.()
    }
  }, [])

  const initials = (() => {
    const email = session?.user?.email || ''
    const name = (session?.user?.user_metadata?.full_name as string) || ''
    const base = name || email.split('@')[0]
    return base ? base.slice(0, 2).toUpperCase() : 'HI'
  })()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/auth/logout')
  }

  const navItem = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5"
    >
      {label}
    </Link>
  )

  const nextParam = encodeURIComponent(router.asPath || '/')

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Left: brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
            H
          </span>
          <span className="hidden sm:inline">HEMPIN</span>
        </Link>

        {/* Middle: universes */}
        <nav className="hidden md:flex items-center gap-1">
          {navItem('/supermarket', 'Supermarket')}
          {navItem('/trade', 'Trade')}
          {navItem('/events', 'Events')}
          {navItem('/research', 'Research')}
          {navItem('/experiments', 'Experiments')}
        </nav>

        {/* Right: auth state */}
        <div className="relative">
          {!session ? (
            <Link
              href={`/signin?next=${nextParam}`}
              className="btn btn-primary text-sm"
            >
              Sign in
            </Link>
          ) : (
            <>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 hover:bg-white/20"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold">
                  {initials}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-xl backdrop-blur"
                >
                  <Link
                    href="/account/profile"
                    className="block px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}