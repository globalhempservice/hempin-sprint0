// components/SidebarLayout.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  type ReactElement,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/authGuard'

type Variant = 'account' | 'admin'
type IconFC = (props: { className?: string }) => ReactElement

type NavItem = {
  href: string
  label: string
  icon: IconFC
}

type Props = {
  variant: Variant
  children: ReactNode
}

const ICON = {
  home: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V16a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v4.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  box: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m21 7-9-4-9 4 9 4 9-4ZM3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  tag: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 13 13 20a2.828 2.828 0 0 1-4 0l-5-5V4h11l5 5a2.828 2.828 0 0 1 0 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 3v4M17 3v4M3 9h18M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  beaker: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3h12M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  leaf: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 19c8 0 14-6 14-14 0 0-9-1-14 4S4 18 4 18l8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 19h16M7 16v-5M12 19v-9M17 19v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shield: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l8 4v6c0 5-3.5 8-8 8S4 18 4 13V7l8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const NAV_ACCOUNT: NavItem[] = [
  { href: '/account/profile', label: 'Profile', icon: ICON.leaf },
  { href: '/account/brand', label: 'Brands', icon: ICON.tag },
  { href: '/account/events', label: 'Events', icon: ICON.calendar },
  { href: '/account/trade', label: 'Trade', icon: ICON.box },
  { href: '/account/research', label: 'Research', icon: ICON.beaker },
  { href: '/account/experiments', label: 'Experiments', icon: ICON.chart },
]

const NAV_ADMIN: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: ICON.home },
  { href: '/admin/review', label: 'Review', icon: ICON.shield },
  { href: '/admin/brands', label: 'Brands', icon: ICON.tag },
  { href: '/admin/events', label: 'Events', icon: ICON.calendar },
  { href: '/admin/featured', label: 'Featured', icon: ICON.leaf },
  { href: '/admin/stats', label: 'Stats', icon: ICON.chart },
]

export default function SidebarLayout({ variant, children }: Props) {
  const router = useRouter()
  const { user, session } = useAuth()

  // NOTE: removed auto-redirect on !session to stop account/signin loop.
  // Pages render a sign-in card if needed; this layout stays neutral.

  // close the drawer on route change (mobile)
  useEffect(() => {
    const close = () => setDrawerOpen(false)
    router.events.on('routeChangeComplete', close)
    return () => router.events.off('routeChangeComplete', close)
  }, [router.events])

  const nav = useMemo(() => (variant === 'admin' ? NAV_ADMIN : NAV_ACCOUNT), [variant])

  const isActive = (href: string) =>
    router.pathname === href ||
    (href !== '/account' && href !== '/admin' && router.pathname.startsWith(href))

  const initials =
    (user?.email || '').split('@')[0].slice(0, 2).toUpperCase() || 'HI'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/logout')
  }

  const key = `hempin.sidebar.collapsed:${variant}`
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // restore collapsed state
  useEffect(() => {
    try {
      const v = localStorage.getItem(key)
      if (v) setCollapsed(v === '1')
    } catch {}
  }, [key])

  // persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(key, collapsed ? '1' : '0')
    } catch {}
  }, [key, collapsed])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* top nav (mobile) */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[var(--surface)]/70 backdrop-blur px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Link href="/" className="font-semibold">HEMPIN</Link>
          <div className="text-sm opacity-70">{session ? initials : 'Guest'}</div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-[auto,1fr] gap-4 p-4">
        {/* sidebar */}
        <aside
          className={[
            'rounded-2xl border border-white/10 bg-[var(--surface)]/80',
            'backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)]',
            collapsed ? 'w-[4.25rem]' : 'w-72',
          ].join(' ')}
        >
          <div className={collapsed ? 'mb-3 flex flex-col items-center gap-2' : 'mb-3 flex items-center justify-between'}>
            <Link
              href={variant === 'admin' ? '/admin' : '/account'}
              className={['flex items-center gap-2 text-sm font-semibold', collapsed ? 'justify-center' : ''].join(' ')}
            >
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                {collapsed ? 'HI' : 'H'}
              </div>
              {!collapsed && <span className="tracking-wide">HEMPIN</span>}
            </Link>

            {!collapsed && (
              <button
                onClick={() => setCollapsed(v => !v)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs"
              >
                {collapsed ? '»' : '«'}
              </button>
            )}
          </div>

          {/* user chip */}
          <div className={['mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3', collapsed ? 'text-center' : ''].join(' ')}>
            <div className={['flex items-center', collapsed ? 'justify-center' : 'gap-3'].join(' ')}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400/20 text-emerald-200">
                {initials}
              </div>
              {!collapsed && (
                <div>
                  <div className="text-sm font-medium">{session ? user?.email : 'Guest'}</div>
                  <div className="text-xs opacity-60">{variant === 'admin' ? 'Admin' : 'Account'}</div>
                </div>
              )}
            </div>
          </div>

          {/* nav */}
          <nav className="mx-2 mb-2 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                  isActive(item.href) ? 'bg-white/10' : 'hover:bg-white/5',
                ].join(' ')}
              >
                <item.icon className="h-5 w-5 opacity-80" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* actions */}
          <div className="mx-2 mb-4 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-sm hover:bg-white/10"
            >
              Home
            </Link>
            {session ? (
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <Link
                href={`/signin?next=${encodeURIComponent('/account/profile')}`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Sign in
              </Link>
            )}
          </div>
        </aside>

        {/* main */}
        <main>{children}</main>
      </div>

      {/* mobile drawer */}
      {(
        <div
          className={[
            'fixed inset-0 z-40 sm:hidden transition',
            drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
          onClick={() => setDrawerOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className={[
              'absolute left-0 top-0 h-full w-72 bg-[var(--surface)]/95 backdrop-blur border-r border-white/10 p-4',
              'shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)] transition-transform',
              drawerOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <Link href="/account" className="font-semibold">HEMPIN</Link>
              <button onClick={() => setDrawerOpen(false)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">✕</button>
            </div>

            <nav className="space-y-1">
              {NAV_ACCOUNT.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'block rounded-lg px-3 py-2 text-sm',
                    isActive(item.href) ? 'bg-white/10' : 'hover:bg-white/5',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}