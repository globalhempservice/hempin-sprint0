// pages/services.tsx
import Head from 'next/head'
import AppShell from '../components/AppShell'

export default function ServicesPublic() {
  return (
    <AppShell title="Services">
      <Head><title>Services • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Instant brand pages"
              desc="Beautiful pages with images, story and links — no code." />
        <Card title="Product slots"
              desc="Publish and manage a limited number of products per plan." />
        <Card title="Built-in payments"
              desc="Secure checkout via PayPal. Simple pricing; keep what you sell." />
        <Card title="Moderation & quality"
              desc="We review submissions to keep the marketplace trusted." />
        <Card title="Roadmap"
              desc="Wholesale tools, collabs, analytics and more after launch." />
      </div>
    </AppShell>
  )
}

function Card({ title, desc }: { title:string; desc:string }) {
  return (
    <div className="card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-sm text-zinc-400 mt-1">{desc}</p>
    </div>
  )
}