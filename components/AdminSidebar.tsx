// components/AdminSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'

const items = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/review', label: 'Review', icon: '🗂️' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
]

export default function AdminSidebar() {
  const { pathname } = useRouter()
  return (
    <aside className="w-[240px] shrink-0 h-screen sticky top-0 p-3 bg-[linear-gradient(180deg,rgba(29,41,34,.6),rgba(22,26,25,.4))] border-r border-white/10 backdrop-blur-xl">
      <div className="px-2 py-3 text-sm font-semibold tracking-wide text-[var(--text-2)]">HEMPIN • Admin</div>
      <nav className="mt-2 grid gap-1">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg border',
                active ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10',
              ].join(' ')}
            >
              <span className="select-none">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-2 text-[var(--text-2)] text-xs opacity-70">Password-gated • service-role API</div>
    </aside>
  )
}