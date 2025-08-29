// components/SidebarLayout.tsx
import { useState } from 'react'
import type { ReactNode, ReactElement, JSX } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser'

type Variant = 'account' | 'admin'

type NavItem = {
  href: string
  label: string
  // was: icon: (props: { className?: string }) => JSX.Element
  icon: (props: { className?: string }) => ReactElement | ReactNode
}

type Props = {
  variant: Variant
  children: React.ReactNode
}

const ICON = {
  home: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V15a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  box: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="m21 7-9-4-9 4 9 4 9-4ZM3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  tag: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M20 13 11 4H4v7l9 9 7-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  credit: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/></svg>
  ),
  wrench: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M14.5 5.5a4.5 4.5 0 0 0-6.2 5.8L3 16.5 7.5 21l5.2-5.3A4.5 4.5 0 1 0 14.5 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  list: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  dollar: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M12 2v20M16.5 6.5a3.5 3.5 0 1 0-7 0c0 1.933 1.567 3.5 3.5 3.5h1c1.933 0 3.5 1.567 3.5 3.5a3.5 3.5 0 1 1-7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  user: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M4 20a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
  ),
  chevronLeft: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  chevronRight: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  menu: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  close: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
}

const NAV_ACCOUNT: NavItem[] = [
  { href: '/account', label: 'Account home', icon: ICON.home },
  { href: '/account/brand', label: 'My brand', icon: ICON.tag },
  { href: '/account/products', label: 'My products', icon: ICON.box },
  { href: '/account/billing', label: 'Billing', icon: ICON.credit },
  { href: '/account/services', label: 'HEMPIN services', icon: ICON.wrench },
]

const NAV_ADMIN: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: ICON.home },
  { href: '/admin/submissions', label: 'Pending submissions', icon: ICON.list },
  { href: '/admin/payments', label: 'Payments', icon: ICON.dollar },
]

export default function SidebarLayout({ variant, children }: Props) {
  const router = useRouter()
  const { user, session } = useUser()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const key = `hempin.sidebar.collapsed:${variant}`

  // persisted collapsed state
  useEffect(() => {
    const v = localStorage.getItem(key)
    if (v === '1') setCollapsed(true)
  }, [key])
  useEffect(() => {
    localStorage.setItem(key, collapsed ? '1' : '0')
  }, [collapsed, key])

  // close drawer on route change
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
    (user?.email || '')
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase() || 'HI'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/logout')
  }

  const Rail = (
    <div
      className={[
        'flex h-[calc(100vh-1.5rem)] flex-col',
        'rounded-2xl border border-white/10 bg-white/5/10 backdrop-blur',
        'shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)]',
        collapsed ? 'w-16' : 'w-72',
        'p-3',
      ].join(' ')}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Link
          href={variant === 'admin' ? '/admin' : '/account'}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
            {collapsed ? 'HI' : 'H'}
          </div>
          {!collapsed && <span className="tracking-wide">HEMPIN</span>}
        </Link>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(c => !c)}
          className="rounded-lg p-1.5 text-zinc-300/80 hover:bg-white/5"
        >
          {collapsed ? (
            <ICON.chevronRight className="h-5 w-5" />
          ) : (
            <ICON.chevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {nav.map(item => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-300/90 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer (identity + logout) */}
      <div className="mt-3">
        <button
          onClick={handleLogout}
          className="mb-2 w-full rounded-xl border border-emerald-400/30 px-3 py-2 text-center text-sm text-emerald-300 hover:bg-emerald-400/10"
        >
          Log out
        </button>
        <Link
          href="/account/profile"
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-white/5"
        >
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm text-white/90">{user?.email || 'Guest'}</div>
              <div className="truncate text-xs text-zinc-400">View profile</div>
            </div>
          )}
        </Link>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      {/* mobile top bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center justify-between border-b border-white/5 bg-black/60 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-300 hover:bg-white/5"
          aria-label="Open navigation"
        >
          <ICON.menu className="h-5 w-5" />
          <span className="text-sm">{variant === 'admin' ? 'Admin' : 'Account'}</span>
        </button>
        <Link
          href="/"
          className="rounded-lg px-2 py-1 text-sm text-zinc-300 hover:bg-white/5"
        >
          Back to site
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto,1fr]">
        {/* Sticky rail (desktop) */}
        <aside className="sticky top-4 hidden self-start lg:block">
          {Rail}
        </aside>

        {/* Content */}
        <main className="min-h-screen pb-12">{children}</main>
      </div>

      {/* Drawer (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[20rem] p-3">
            <div className="mb-2 flex items-center justify-end">
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-2 text-zinc-300 hover:bg-white/5"
                aria-label="Close navigation"
              >
                <ICON.close className="h-5 w-5" />
              </button>
            </div>
            {Rail}
          </div>
        </div>
      )}
    </div>
  )
}