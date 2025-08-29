// pages/account/services.tsx
import Head from 'next/head'
import AccountShell from '../../components/AccountShell'
import Link from 'next/link'

export default function AccountServices() {
  return (
    <AccountShell title="HEMPIN Services">
      <Head><title>Services • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold mb-1">Brand Page</h3>
          <p className="opacity-80 text-sm mb-3">Get a hosted brand profile with images, story, and contact.</p>
          <div className="flex gap-2">
            <Link href="/account/brand" className="btn btn-outline">Open builder</Link>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-1">Product Pages</h3>
          <p className="opacity-80 text-sm mb-3">Create up to five product pages linked to your brand.</p>
          <div className="flex gap-2">
            <Link href="/account/products" className="btn btn-outline">Manage products</Link>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-1">Full Kit (Brand + 5 Products)</h3>
          <p className="opacity-80 text-sm mb-3">Best value: everything you need to launch your presence.</p>
          <div className="flex gap-2">
            <Link href="/account/billing" className="btn btn-primary">Go to billing</Link>
          </div>
        </div>
      </div>
    </AccountShell>
  )
}