[PASTE THE AccountSidebar.tsx CONTENT HERE]
// components/AccountSidebar.tsx
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

type Props = {
  open: boolean
  onClose: () => void
  userEmail?: string | null
}

export default function AccountSidebar({ open, onClose, userEmail }: Props) {
  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0d0f12] border-r border-white/10 p-4 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm opacity-70">{userEmail ? 'Signed in as' : 'Guest'}</div>
          <button className="text-sm opacity-70 hover:opacity-100" onClick={onClose}>Close</button>
        </div>

        <div className="font-medium truncate mb-4">{userEmail ?? 'Not signed in'}</div>

        <nav className="grid gap-1">
          <Link href="/account" className="btn btn-ghost justify-start">Account home</Link>
          <Link href="/account/billing" className="btn btn-ghost justify-start">Billing & entitlements</Link>
          <Link href="/brand" className="btn btn-ghost justify-start">My brand</Link>
          <Link href="/account/products" className="btn btn-ghost justify-start">Products (test)</Link>
          <Link href="/services" className="btn btn-ghost justify-start">Services</Link>
        </nav>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            className="btn btn-outline w-full"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/account'
            }}
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}