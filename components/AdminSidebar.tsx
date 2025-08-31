// components/AdminSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const ICON = {
  home: (p:{className?:string}) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V15a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  list: (p:{className?:string}) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  dollar: (p:{className?:string}) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M12 2v20M16.5 6.5a3.5 3.5 0 1 0-7 0c0 1.933 1.567 3.5 3.5 3.5h1c1.933 0 3.5 1.567 3.5 3.5a3.5 3.5 0 1 1-7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  chevronLeft: (p:{className?:string}) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  chevronRight: (p:{className?:string}) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
}

export default function AdminSidebar() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const items = [
    { href: '/admin', label: 'Dashboard', icon: ICON.home },
    { href: '/admin/submissions', label: 'Pending submissions', icon: ICON.list },
    { href: '/admin/payments', label: 'Payments', icon: ICON.dollar },
  ]

  const isActive = (href: string) =>
    router.pathname === href || (href !== '/admin' && router.pathname.startsWith(href))

  async function logoutAdmin() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/logout')
  }

  return (
    <aside className="sticky top-6 self-start">
      <div className={[
          'flex h-[calc(100vh-2rem)] flex-col p-3',
          'rounded-2xl border border-white/10 ring-1 ring-white/5',
          'bg-gradient-to-b from-emerald-500/10 via-zinc-900/60 to-black/80',
          'backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)]',
          collapsed ? 'w-[4.25rem]' : 'w-72',
        ].join(' ')}
      >
        {/* Header */}
        <div className={collapsed ? 'mb-3 flex flex-col items-center gap-2' : 'mb-3 flex items-center justify-between'}>
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
              {collapsed ? 'HI' : 'H'}
            </div>
            {!collapsed && <span className="tracking-wide">HEMPIN</span>}
          </Link>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(v => !v)}
            className="rounded-lg p-1.5 text-zinc-300/80 hover:bg-white/5"
          >
            {collapsed ? <ICON.chevronRight className="h-5 w-5" /> : <ICON.chevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {items.map(it => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={[
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm',
                    isActive(it.href) ? 'bg-white/10 text-white' : 'text-zinc-300/90 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <it.icon className="h-5 w-5" />
                  {!collapsed && <span className="truncate">{it.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — only the admin logout button now */}
        <div className="mt-3">
          <button
            onClick={logoutAdmin}
            className="w-full rounded-xl border border-emerald-400/30 px-3 py-2 text-center text-sm text-emerald-300 hover:bg-emerald-400/10"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
