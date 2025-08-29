// pages/account/services.tsx
import Head from 'next/head'
import AccountShell from '../../components/AccountShell'

export default function AccountServices() {
  return (
    <AccountShell title="HEMPIN services">
      <Head><title>Services • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <SvcCard
          title="Brand page"
          desc="Spin up a public brand page with images, story and links."
        />
        <SvcCard
          title="Product pages"
          desc="Add products with photos, pricing and publish to the directory."
        />
        <SvcCard
          title="Moderation & quality"
          desc="We review content to keep the directory trusted."
        />
        <SvcCard
          title="Roadmap"
          desc="Wholesale tools, collabs and analytics coming after launch."
        />
      </div>
    </AccountShell>
  )
}

function SvcCard({ title, desc }: { title:string; desc:string }) {
  return (
    <div className="card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-sm text-zinc-400 mt-1">{desc}</p>
    </div>
  )
}