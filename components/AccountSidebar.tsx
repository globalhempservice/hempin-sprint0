// components/AccountSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser'

type Item = { href: string; label: string }

export default function AccountSidebar() {
  const router = useRouter()
  const { user, profile } = useUser()
  const isAdmin = profile?.role === 'admin'

  const common: Item[] = [
    { href: '/account', label: 'Account home' },
    { href: '/account/brand', label: 'My brand' },
    { href: '/account/products', label: 'My products' },
    { href: '/account/billing', label: 'Billing' },
    { href: '/services', label: 'HEMPIN services' },
  ]

  const adminOnly: Item[] = isAdmin
    ? [
        { href: '/admin', label: 'Admin dashboard' },
        { href: '/admin/submissions', label: 'Pending submissions' },
        { href: '/admin/payments', label: 'Payments' },
      ]
    : []

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/auth/logout')
  }

  return (
    <aside className="w-[230px] shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-xs opacity-70">
        Signed in as<br />{user?.email ?? '—'}
      </div>

      <nav className="flex flex-col gap-2">
        {[...common, ...adminOnly].map((i) => (
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