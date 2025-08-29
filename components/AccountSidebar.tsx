// components/AccountSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser'   // ✅ named import

type Item = { href: string; label: string }

export default function AccountSidebar() {
  const router = useRouter()
  const { user, profile, signOut } = useUser() // profile.role used for admin link

  const common: Item[] = [
    { href: '/account', label: 'Account home' },
    { href: '/account/billing', label: 'Billing & entitlements' },
    { href: '/account/brand', label: 'My brand' },
    { href: '/account/products', label: 'Products (test)' },
    { href: '/shop', label: 'Shop' },
  ]

  const admin: Item[] = profile?.role === 'admin'
    ? [{ href: '/admin', label: 'Admin' }]
    : []

  const items = [...common, ...admin]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/auth/logout') // a simple “logged out” confirmation page
  }

  return (
    <aside className="w-[230px] shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-xs opacity-70">
        Signed in as<br />{user?.email ?? 'Guest'}
      </div>

      <nav className="flex flex-col gap-2">
        {items.map(i => (
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