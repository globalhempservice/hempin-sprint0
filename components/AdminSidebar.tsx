// components/AdminSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser' // named export

const NAV: { href: string; label: string }[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/submissions', label: 'Pending submissions' },
  { href: '/admin/payments', label: 'Payments' },
]

export default function AdminSidebar() {
  const router = useRouter()
  const { user } = useUser()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/auth/logout') // simple “You’re logged out” page
  }

  return (
    <aside className="w-[230px] shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-xs opacity-70">
        Signed in as<br />{user?.email ?? '—'}
      </div>

      <nav className="flex flex-col gap-2">
        {NAV.map((i) => (
          <Link key={i.href} href={i.href} className="hover:underline">
            {i.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="btn btn-outline w-full mt-4">
        Log out
      </button>
    </aside>
  )
}