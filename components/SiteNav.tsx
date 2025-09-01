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
  const [open, setOpen] = useState(false)

  // Load + subscribe auth state
  useEffect(() => {
    let mounted = true

    const apply = (user: any | null) => {
      if (!mounted) return
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

    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      apply(session?.user ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Lock scroll while drawer is open
  useEffect(() => {
    const root = document.documentElement
    if (open) root.classList.add('overflow-hidden')
    else root.classList.remove('overflow-hidden')
    return () => root.classList.remove('overflow-hidden')
  }, [open])

  // Build `next` param (for signed-out CTA)
  const nextParam = useMemo(() => {
    const path = router.asPath || '/'
    return `?next=${encodeURIComponent(path)}`
  }, [router.asPath])

  const initials = useMemo(() => {
    if (auth.status !== 'signed_in') return ''
    const base = auth.name || auth.email || ''
    const parts = base.replace(/@.*/, '').split(/[.\s_-]+/).filter(Boolean)
    if (parts.length === 0) return (auth.email || '?').slice(0, 1).toUpperCase()
    const first = parts[0]?.[0] ?? ''
    const second = parts[1]?.[0] ?? ''
    return (first + second).toUpperCase()
  }, [auth])

  async function handleLogout() {
    await supabase.auth.signOut()
    setOpen(false)
    // Send them to homepage; if they were on a gated page, router guards will handle it.
    router.replace('/')
  }

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Left: logo + desktop nav */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                H
              </span>
              HEMPIN
            </Link>

            <ul className="ml-4 hidden gap-5 text-sm md:flex">
              <li><Link href="/trade" className="hover:text-emerald-300">Trade</Link></li>
              <li><Link href="/shop" className="hover:text-emerald-300">Supermarket</Link></li>
              <li><Link href="/events" className="hover:text-emerald-300">Events</Link></li>
              <li><Link href="/knowledge" className="hover:text-emerald-300">Research</Link></li>
              <li><Link href="/experiments" className="hover:text-emerald-300">Experiments</Link></li>
            </ul>
          </div>

          {/* Right: auth / burger */}
          <div className="flex items-center gap-3">
            {/* Desktop auth area */}
            <div className="hidden md:block">
              {auth.status === 'signed_in' ? (
                <Link
                  href="/account/profile"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium ring-1 ring-zinc-700 hover:ring-zinc-500"
                  title={auth.email}
                  aria-label="Open profile"
                >
                  {initials}
                </Link>
              ) : auth.status === 'loading' ? (
                <span className="text-sm opacity-70">…</span>
              ) : (
                <>
                  <Link
                    href={`/signin${nextParam}`}
                    className="text-sm text-zinc-300 hover:text-white mr-2"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={`/signin${nextParam}`}
                    className="btn btn-outline btn-sm"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-zinc-950 ring-1 ring-zinc-800 shadow-xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-800">
              <div className="flex items-center gap-2 font-semibold">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                  H
                </span>
                HEMPIN
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {auth.status === 'signed_in' && (
                <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium ring-1 ring-zinc-700">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {auth.name || 'Profile'}
                      </div>
                      <div className="truncate text-xs text-zinc-400">{auth.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/account/profile"
                      onClick={() => setOpen(false)}
                      className="btn btn-outline btn-xs"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost btn-xs text-zinc-300"
                      aria-label="Log out"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}

              <nav className="space-y-2">
                <Link href="/trade" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-zinc-900">
                  Trade
                </Link>
                <Link href="/shop" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-zinc-900">
                  Supermarket
                </Link>
                <Link href="/events" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-zinc-900">
                  Events
                </Link>
                <Link href="/knowledge" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-zinc-900">
                  Research
                </Link>
                <Link href="/experiments" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-zinc-900">
                  Experiments
                </Link>
              </nav>

              {auth.status === 'signed_out' && (
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/signin${nextParam}`}
                    onClick={() => setOpen(false)}
                    className="btn btn-primary btn-sm flex-1 text-center"
                  >
                    Sign in / Create account
                  </Link>
                </div>
              )}
            </div>

            {/* Panel footer (legal/link) */}
            <div className="border-t border-zinc-800 px-4 py-3 text-xs text-zinc-500">
              © HEMPIN 2025
            </div>
          </div>
        </div>
      )}
    </>
  )
}