// pages/account/brand/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import AccountShell from '../../../components/AccountShell'

export default function AccountBrand() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }
    init()
  }, [])

  return (
    <AccountShell
      title="My brand"
      actions={<a className="btn btn-primary" href="/services">Get a kit / slots</a>}
    >
      {!user && (
        <div className="card">
          <p className="opacity-80">
            You’re not signed in. You can still play with the brand builder as a guest.
          </p>
          <div className="mt-3 flex gap-2">
            <a className="btn btn-primary" href="/brand">Open brand builder</a>
            <a className="btn btn-outline" href="/account">Sign in</a>
          </div>
        </div>
      )}

      {user && (
        <>
          <div className="card">
            <h2 className="font-semibold mb-2">Build or edit your brand</h2>
            <p className="opacity-80">
              Create your brand basics, story, visuals and links. Your public page is scheduled to go
              live with the directory on <strong>November 1st, 2025</strong> (Bangkok edition).
            </p>
            <div className="mt-3 flex gap-2">
              <a className="btn btn-primary" href="/brand">Open brand builder</a>
              <a className="btn btn-outline" href="/brand">Preview public page</a>
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium">Next steps</h3>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Add at least one product page to your brand</li>
              <li>Choose a kit (brand page + product slots, with optional Bangkok showroom)</li>
              <li>We’ll review your submission and confirm by email</li>
            </ul>
            <div className="mt-3">
              <a className="btn btn-ghost" href="/account/products">Go to Products</a>
            </div>
          </div>
        </>
      )}
    </AccountShell>
  )
}