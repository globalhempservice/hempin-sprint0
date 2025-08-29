// pages/account/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AccountShell from '../../components/AccountShell'

export default function AccountHome() {
  return (
    <AccountShell>
      <Head><title>My Account • HEMPIN</title></Head>
      <h1 className="text-2xl font-bold mb-4">Account</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">Brand</div>
              <p className="text-sm text-zinc-400 mt-1">
                Create or edit your brand so you’re ready for the directory launch.
              </p>
            </div>
            <Link href="/account/brand" className="btn btn-primary">Go to Brand Setup</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">My products</div>
              <p className="text-sm text-zinc-400 mt-1">
                Manage product pages under your brand.
              </p>
            </div>
            <Link href="/account/products" className="btn btn-outline">Open</Link>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">Billing & kits</div>
              <p className="text-sm text-zinc-400 mt-1">
                Manage your plan and pop-up kits.
              </p>
            </div>
            <Link href="/account/billing" className="btn btn-outline">View Billing</Link>
          </div>
        </div>
      </div>
    </AccountShell>
  )
}