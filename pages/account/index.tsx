// pages/account/index.tsx
import Head from 'next/head'
import AccountShell from '../../components/AccountShell'
import Link from 'next/link'

export default function AccountHome() {
  return (
    <AccountShell title="Welcome back">
      <Head><title>Account • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Brand */}
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">My Brand</h3>
              <p className="opacity-80 text-sm">Create and customize your brand page.</p>
            </div>
            <Link href="/account/brand" className="btn btn-primary">Go to brand setup</Link>
          </div>
        </div>

        {/* Products */}
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">My Products</h3>
              <p className="opacity-80 text-sm">Add products that will appear on your brand page.</p>
            </div>
            <Link href="/account/products" className="btn btn-outline">Manage products</Link>
          </div>
        </div>

        {/* Billing */}
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Billing</h3>
              <p className="opacity-80 text-sm">Manage your plan and pop-up kits.</p>
            </div>
            <Link href="/account/billing" className="btn btn-outline">Open billing</Link>
          </div>
        </div>

        {/* Services */}
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">HEMPIN Services</h3>
              <p className="opacity-80 text-sm">Brand page, product pages, or the full kit.</p>
            </div>
            <Link href="/account/services" className="btn btn-outline">Browse services</Link>
          </div>
        </div>
      </div>
    </AccountShell>
  )
}