// pages/account/services.tsx
import Head from 'next/head'
import AccountShell from '../../components/AccountShell'

export default function AccountServices() {
  return (
    <AccountShell title="HEMPIN services">
      <Head><title>HEMPIN services • Account</title></Head>

      <div className="space-y-6">
        <p className="text-zinc-300">
          Pick what you need. These are services available to logged-in brands.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Brand / product services bucket */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Brand & product</h3>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>Brand page — create or refresh your public brand page.</li>
              <li>Product pages — publish and manage product listings.</li>
              <li>Special offer — launch limited promos with checkout.</li>
            </ul>
          </div>

          {/* Events bucket (no Bangkok popup items for now as requested) */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Events</h3>
            <p className="text-zinc-300">
              Event add-ons coming soon. We’ll list upcoming pop-ups here.
            </p>
          </div>
        </div>
      </div>
    </AccountShell>
  )
}