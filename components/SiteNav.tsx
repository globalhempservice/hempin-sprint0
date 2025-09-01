// components/SiteNav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type SessionState =
  | { status: 'loading' }
  | { status: 'signed_out' }
  | { status: 'signed_in'; email: string; name?: string | null }

export default function SiteNav() {
  const router = useRouter()
  const [auth, setAuth] = useState<SessionState>({ status: 'loading' })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auth state
  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      const user = data.session?.user ?? null
      if (!user) {
        setAuth({ status: 'signed_out' })
      } else {
        setAuth({
          status: 'signed_in',
          email: user.email || '',
          name: (user.user_metadata?.full_name as string | undefined) ?? null,
        })
      }
    }

    load()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const user = session?.user ?? null
      if (!user) {
        setAuth({ status: 'signed_out' })
      } else {
        setAuth({
          status: 'signed_in',
          email: user.email || '',
          name: (user.user_metadata?.full_name as string | undefined) ?? null,
        })
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    const handle = () => setMobileOpen(false)
    router.events.on('routeChangeComplete', handle)
    return () => router.events.off('routeChangeComplete', handle)
  }, [router.events])

  // `next` param for auth links
  const nextParam = useMemo(() => {
    const path = router.asPath || '/'
    return `?next=${encodeURIComponent(path)}`
  }, [router.asPath])

  const initials = useMemo(() => {
    if (auth.status !== 'signed_in') return ''
    const base = auth.name || auth.email || ''
    const parts = base.replace(/@.*/, '').split(/[.\s_-]+/).filter(Boolean)
    if (parts.length === 0) return (auth.email || '?').slice(0, 1).toUpperCase()
    const first = parts[0].slice(0, 1)
    const second = parts[1]?.slice(0, 1) || ''
    return (first + second).toUpperCase()
  }, [auth])

  const NavLinks = ({ className = '' }: { className?: string }) => (
    <ul className={['gap-5 text-sm', className].join(' ')}>
      <li><Link href="/trade" className="block py-2 hover:text-emerald-300">Trade</Link></li>
      <li><Link href="/supermarket" className="block py-2 hover:text-emerald-300">Supermarket</Link></li>
      <li><Link href="/events" className="block py-2 hover:text-emerald-300">Events</Link></li>
      <li><Link href="/research" className="block py-2 hover:text-emerald-300">Research</Link></li>
      <li><Link href="/experiments" className="block py-2 hover:text-emerald-300">Experiments</Link></li>
    </ul>
  )

  const AuthButtons = () => (
    auth.status === 'signed_in' ? (
      <Link
        href="/account/profile"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium ring-1 ring-zinc-700 hover:ring-zinc-500"
        title={auth.email}
        aria-label="Open profile"
      >
        {initials}
      </Link>
    ) : auth.status === 'loading' ? (
      <span className="text-sm opacity-70" aria-live="polite">…</span>
    ) : (
      <div className="flex items-center gap-3">
        <Link
          href={`/signin${nextParam}`}
          className="text-sm text-zinc-300 hover:text-white"
        >
          Sign in
        </Link>
        <Link
          href={`/signin${nextParam}`}
          className="btn btn-outline btn-sm"
        >
          Create account
        </Link>
      </div>
    )
  )

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/70 backdrop-blur">
      {/* Top bar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Global">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              H
            </span>
            HEMPIN
          </Link>

          {/* Desktop nav */}
          <div className="ml-4 hidden md:block">
            <NavLinks className="flex items-center" />
          </div>
        </div>

        {/* Right: auth + burger */}
        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center rounded-md p-2 ring-1 ring-zinc-700 hover:ring-zinc-500 md:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-zinc-950/95 ring-1 ring-white/10 p-4">
            {/* Header row in drawer */}
            <div className="mb-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                  H
                </span>
                HEMPIN
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 ring-1 ring-zinc-700 hover:ring-zinc-500"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <NavLinks className="grid" />

              {/* Mobile auth */}
              <div className="pt-2">
                {auth.status === 'signed_in' ? (
                  <Link
                    href="/account/profile"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 items-center gap-3 rounded-full bg-zinc-900 px-4 ring-1 ring-zinc-700 hover:ring-zinc-500"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium">
                      {initials}
                    </span>
                    <span className="text-sm">Profile</span>
                  </Link>
                ) : auth.status === 'loading' ? (
                  <span className="text-sm opacity-70">Checking…</span>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      href={`/signin${nextParam}`}
                      onClick={() => setMobileOpen(false)}
                      className="btn btn-primary btn-sm text-center"
                    >
                      Sign in
                    </Link>
                    <Link
                      href={`/signin${nextParam}`}
                      onClick={() => setMobileOpen(false)}
                      className="btn btn-outline btn-sm text-center"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Footer bits (optional) */}
            <div className="mt-8 border-t border-white/10 pt-3 text-xs text-zinc-400">
              <div className="flex items-center justify-between">
                <Link href="/legal" onClick={() => setMobileOpen(false)} className="hover:text-zinc-200">
                  Legal
                </Link>
                <span>© HEMPIN 2025</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}