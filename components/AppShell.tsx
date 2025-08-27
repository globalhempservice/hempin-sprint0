// components/AppShell.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'

type Props = {
  children: ReactNode
  admin?: boolean
}

export default function AppShell({ children, admin = false }: Props) {
  const router = useRouter()

  async function logout() {
    try {
      await supabase.auth.signOut()
    } finally {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-neutral-800 p-4 space-y-3">
        <div className="text-lg font-semibold mb-4">HEMP’IN</div>

        {!admin ? (
          <nav className="space-y-2">
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/account">
              Account home
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/account/billing">
              Billing & Entitlements
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/account/brand">
              My Brand
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/account/products">
              Products (test)
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/shop">
              Shop
            </Link>
          </nav>
        ) : (
          <nav className="space-y-2">
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/admin">
              Admin home
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/admin/payments">
              Payments
            </Link>
            <Link className="block px-2 py-1 rounded hover:bg-neutral-800" href="/admin/brands">
              Brand queue
            </Link>
          </nav>
        )}

        <button
          onClick={logout}
          className="mt-6 inline-flex items-center rounded bg-neutral-800 hover:bg-neutral-700 px-3 py-1 text-sm"
        >
          Log out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
