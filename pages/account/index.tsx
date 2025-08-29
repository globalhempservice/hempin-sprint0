// pages/account/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AccountShell from '../../components/AccountShell'

export default function AccountHome() {
  return (
    <AccountShell title="Account">
      <Head><title>Account • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Brand"
          desc="Create or edit your brand so you’re ready for the directory launch."
          href="/account/brand"
          cta="Go to Brand Setup"
        />
        <Card
          title="My products"
          desc="Manage your product pages and publishing slots."
          href="/account/products"
          cta="Open products"
        />
        <Card
          title="Billing & kits"
          desc="Manage your plan and pop-up kits."
          href="/account/billing"
          cta="View billing"
        />
      </div>
    </AccountShell>
  )
}

function Card({
  title, desc, href, cta,
}: { title:string; desc:string; href:string; cta:string }) {
  return (
    <div className="card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-sm text-zinc-400 mt-1">{desc}</p>
      <div className="mt-4">
        <Link href={href} className="btn btn-primary">{cta}</Link>
      </div>
    </div>
  )
}