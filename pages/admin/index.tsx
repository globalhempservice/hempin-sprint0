// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function AdminHome() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
      if (!error) setPendingCount(count ?? 0)
    }
    load()
  }, [])

  return (
    <AdminShell title="Admin dashboard">
      <Head><title>Admin • Dashboard</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Pending submissions"
          desc="Review and approve brands before they go live."
          cta="Open submissions"
          href="/admin/submissions"
          badge={pendingCount === null ? '…' : String(pendingCount)}
        />

        <Card
          title="Payments"
          desc="See PayPal captures received by HEMPIN."
          cta="View payments"
          href="/admin/payments"
        />
      </div>
    </AdminShell>
  )
}

function Card({
  title, desc, cta, href, badge,
}: { title:string; desc:string; cta:string; href:string; badge?:string }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <p className="text-sm text-zinc-400 mt-1">{desc}</p>
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800">{badge}</span>
        )}
      </div>
      <div className="mt-4">
        <Link className="btn btn-primary" href={href}>{cta}</Link>
      </div>
    </div>
  )
}