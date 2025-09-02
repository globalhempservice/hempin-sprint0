import Head from 'next/head'
import useSWR from 'swr'
import SidebarLayout from '../../components/SidebarLayout'
import { redirectToAdminLogin, hasValidAdminCookie } from '../../lib/adminAuth'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminDashboard() {
  const { data } = useSWR('/api/admin/dashboard', fetcher, { revalidateOnFocus: false })
  const stats = data?.stats || { brandsPending: 0, eventsPending: 0, brandsApproved: 0, eventsApproved: 0, productsApproved: 0, usersTotal: 0, ordersTotal: 0 }
  const recentBrands = data?.recentBrands || []
  const recentEvents = data?.recentEvents || []

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin — Dashboard</title></Head>
      <h1 className="text-2xl font-semibold mb-4">Admin — Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Pending submissions"
          primary={stats.brandsPending + stats.eventsPending}
          lines={[
            { label: 'Brands (pending)', value: String(stats.brandsPending) },
            { label: 'Events (pending)', value: String(stats.eventsPending) },
          ]}
          cta={{ label: 'Review', href: '/admin/review' }}
        />
        <StatCard
          title="Approved & live"
          primary={stats.brandsApproved + stats.eventsApproved + stats.productsApproved}
          lines={[
            { label: 'Brands (approved)', value: String(stats.brandsApproved) },
            { label: 'Events (approved)', value: String(stats.eventsApproved) },
            { label: 'Products (approved)', value: String(stats.productsApproved) },
          ]}
        />
        <StatCard
          title="Users & orders"
          primary={stats.usersTotal}
          lines={[
            { label: 'Users (profiles)', value: String(stats.usersTotal) },
            { label: 'Orders (total)', value: String(stats.ordersTotal) },
          ]}
          cta={{ label: 'Payments', href: '/admin/payments' }}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Recent
          title="Recent brands"
          rows={recentBrands.map((b: any) => ({
            id: b.id, title: b.name, slug: b.slug, meta: b.approved ? 'approved' : 'pending', href: `/brands/${b.slug}`
          }))}
          reviewHref="/admin/review"
        />
        <Recent
          title="Recent events"
          rows={recentEvents.map((e: any) => ({
            id: e.id, title: e.title, slug: e.slug, meta: e.status, href: `/events/${e.slug}`
          }))}
          reviewHref="/admin/review?tab=events"
        />
      </div>
    </SidebarLayout>
  )
}

function StatCard({ title, primary, lines, cta }: any) {
  return (
    <div className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
      <div className="text-[var(--text-2)] text-sm">{title}</div>
      <div className="text-5xl font-semibold mt-2">{primary}</div>
      <ul className="mt-3 space-y-1 text-sm text-[var(--text-2)]">
        {lines.map((l: any) => <li key={l.label} className="flex justify-between"><span>{l.label}</span><span>{l.value}</span></li>)}
      </ul>
      {cta && <Link href={cta.href} className="inline-block mt-3 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">{cta.label}</Link>}
    </div>
  )
}

function Recent({ title, rows, reviewHref }: any) {
  return (
    <div className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        <Link href={reviewHref} className="text-sm underline">Review</Link>
      </div>
      {!rows.length && <div className="text-[var(--text-2)] text-sm">No items yet.</div>}
      <ul className="grid gap-2">
        {rows.map((r: any) => (
          <li key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="font-medium truncate">{r.title}</div>
            <div className="text-xs text-[var(--text-2)] truncate">{r.slug} • {r.meta}</div>
            <div className="mt-1"><Link href={r.href} className="text-xs underline">Open</Link></div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Server-side cookie gate: admin only
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}