// pages/account/billing.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useEntitlements } from '../../lib/useEntitlements'
import AccountShell from '../../components/AccountShell'

export default function Billing() {
  const [user, setUser] = useState<any>(null)
  const { data: ent, loading } = useEntitlements()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }
    init()
  }, [])

  return (
    <AccountShell
      title="Billing & entitlements"
      actions={<a className="btn btn-primary" href="/services">Shop services</a>}
    >
      {!user && (
        <div className="card">
          <p className="opacity-80">Sign in to view your billing and entitlements.</p>
          <div className="mt-3">
            <a className="btn btn-outline" href="/account">Go to Account</a>
          </div>
        </div>
      )}

      {user && (
        <>
          <div className="card">
            <h2 className="font-semibold mb-2">Your entitlements</h2>
            {loading ? (
              <p>Loading…</p>
            ) : (
              <ul className="grid gap-2">
                <li className="rounded-md bg-white/5 px-3 py-2">
                  Brand page: <strong>{ent?.brand_page ? 'Enabled' : 'Not purchased'}</strong>
                </li>
                <li className="rounded-md bg-white/5 px-3 py-2">
                  Product slots: <strong>{ent?.product_slots ?? 0}</strong>
                </li>
                <li className="rounded-md bg-white/5 px-3 py-2">
                  Bangkok 2025 showroom: <strong>{ent?.popup_bkk_2025 ? 'Included' : 'Not purchased'}</strong>
                </li>
                <li className="rounded-md bg-white/5 px-3 py-2">
                  Extra popup products: <strong>{ent?.popup_extras ?? 0}</strong>
                </li>
              </ul>
            )}
            <div className="mt-3 flex gap-2">
              <a className="btn btn-primary" href="/services">Get a kit / add slots</a>
              <a className="btn btn-outline" href="/brand">Create/preview brand</a>
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium mb-1">Invoices & receipts</h3>
            <p className="opacity-80">
              Coming soon. You’ll be able to download PDF invoices for your orders here.
            </p>
          </div>
        </>
      )}
    </AccountShell>
  )
}