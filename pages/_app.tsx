// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

const isProtected = (p: string) => p.startsWith('/account') || p.startsWith('/admin')

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const run = async () => {
      if (!isProtected(router.pathname)) {
        setReady(true)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace(`/signin?next=${encodeURIComponent(router.asPath)}`)
        return
      }

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!session && isProtected(router.pathname)) router.replace('/signin')
      })
      unsub = () => sub.subscription.unsubscribe()
      setReady(true)
    }

    run()
    return () => { if (unsub) unsub() }
  }, [router.pathname, router.asPath])

  if (!ready) return null
  return <>{children}</>
}

/** Minimal public-site chrome so users can navigate/sign in */
function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-wide text-emerald-300">HEMP’IN</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/start" className="hover:text-white">Start</Link>
            <Link href="/bangkok-2025" className="hover:text-white">Bangkok 2025</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link
              href="/signin"
              className="rounded-lg border border-emerald-400/40 px-3 py-1.5 text-emerald-300 hover:bg-emerald-400/10"
            >
              Sign in / Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-400 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} HEMP’IN</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const protectedRoute = isProtected(router.pathname)

  const content = <Component {...pageProps} />

  return (
    <RouteGuard>
      {protectedRoute ? content : <PublicChrome>{content}</PublicChrome>}
    </RouteGuard>
  )
}