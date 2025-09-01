// components/SiteNav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'

type SessionState =
  | { status: 'loading' }
  | { status: 'signed_out' }
  | { status: 'signed_in'; email: string; name?: string | null }

export default function SiteNav() {
  const router = useRouter()
  const [auth, setAuth] = useState<SessionState>({ status: 'loading' })

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
      sub.subscription.unsubscribe()
    }
  }, [])

  // Build `next` param only when logged out
  const nextParam = useMemo(() => {
    const path = router.asPath || '/'
    const encoded = encodeURIComponent(path)
    return `?next=${encoded}`
  }, [router.asPath])

  const initials = useMemo(() => {
    if (auth.status !== 'signed_in') return ''
    const base = auth.name || auth.email || ''
    const parts = base.replace(/@.*/, '').split(/[.\s_-]+/).filter(Boolean)
    if (parts.length === 0) return (auth.email || '?').slice(0, 1).toUpperCase()
    const first = parts[0].slice(0, 1)
    const second = (parts[1]?.slice(0, 1) || '')
    return (first + second).toUpperCase()
  }, [auth])

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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

        <div className="flex items-center gap-3">
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
            </>
          )}
        </div>
      </nav>
    </header>
  )
}