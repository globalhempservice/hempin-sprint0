// pages/account/index.tsx
import { useEffect, useState } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import { useUser } from '../../lib/useUser'
import SignInPanel from '../../components/SignInPanel'

export default function AccountHome() {
  const { user, loading } = useUser()

  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Account</h1>

        {loading && <p className="opacity-70">Loading…</p>}

        {!loading && !user && (
          <>
            <p className="opacity-80">Please sign in to view your account.</p>
            <SignInPanel />
          </>
        )}

        {!loading && user && (
          <>
            {/* Lightweight dashboard (keep what you had or start simple) */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-5">
                <h2 className="font-semibold mb-2">Your launch checklist</h2>
                <ul className="text-sm space-y-2 opacity-90">
                  <li>• Create your brand basics</li>
                  <li>• Upload a hero image & logo</li>
                  <li>• Write your brand story</li>
                  <li>• Add at least 1 product page</li>
                  <li>• Choose your kit or slots</li>
                </ul>
              </div>
              <div className="card p-5">
                <h2 className="font-semibold mb-2">Quick links</h2>
                <div className="grid gap-2">
                  <a className="btn btn-outline" href="/account/brand">Edit brand</a>
                  <a className="btn btn-outline" href="/account/billing">Billing & entitlements</a>
                  <a className="btn btn-outline" href="/services">Services</a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}