// components/AdminSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import useUser from '../lib/useUser'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/submissions', label: 'Pending submissions' },
  { href: '/admin/payments', label: 'Payments' },
]

export default function AdminSidebar() {
  const router = useRouter()
  const { user } = useUser()

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(href + '/')

  const onLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/logged-out')
  }

  return (
    <aside className="w-[240px] shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-xs opacity-70">
        Admin<br />
        <span className="text-white/90">{user?.email ?? '—'}</span>
      </div>

      <nav className="flex flex-col gap-2">
        {NAV.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`block px-2 py-1 rounded ${
              isActive(it.href) ? 'text-emerald-300' : 'text-white/80 hover:text-white'
            }`}
          >
            {it.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-4 inline-flex items-center justify-center rounded bg-white/10 px-4 py-2 hover:bg-white/15"
      >
        Log out
      </button>
    </aside>
  )
}