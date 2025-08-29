// pages/account/services/index.tsx
import Head from 'next/head'
import AccountShell from '../../../components/AccountShell'

export default function AccountServices() {
  return (
    <AccountShell>
      <Head><title>HEMPIN services • Account</title></Head>
      <h1 className="text-2xl font-bold mb-4">HEMPIN services</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Brand page"
          desc="Launch a clean, fast brand page with story, images and links."
        />
        <Card
          title="Product pages"
          desc="Create product pages and manage a limited number of slots."
        />
        <Card
          title="Moderation & quality"
          desc="We review submissions to keep the marketplace clean and trusted."
        />
        <Card
          title="Roadmap"
          desc="Wholesale tools, collabs, analytics and more after launch."
        />
      </div>
    </AccountShell>
  )
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-sm text-zinc-400 mt-1">{desc}</p>
    </div>
  )
}