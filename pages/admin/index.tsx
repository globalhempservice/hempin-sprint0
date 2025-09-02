import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SidebarLayout from '../../components/SidebarLayout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth, SignInRequiredCard } from '../../lib/authGuard'

type BrandRow = { id: string; name: string; slug: string; approved: boolean; created_at?: string }
type EventRow = { id: string; title: string; slug: string; status: string; created_at?: string }

type StatBlock = {
  brandsPending: number
  brandsApproved: number
  eventsPending: number
  eventsApproved: number
  productsApproved: number
  usersTotal: number
  ordersTotal: number
}

const initialStats: StatBlock = {
  brandsPending: 0,
  brandsApproved: 0,
  eventsPending: 0,
  eventsApproved: 0,
  productsApproved: 0,
  usersTotal: 0,
  ordersTotal: 0,
}

async function countExact(
  table: string,
  filter?: (q: ReturnType<typeof supabase.from>['select']) => ReturnType<typeof supabase.from>['select']
) {
  try {
    let q = supabase.from(table).select('id', { count: 'exact', head: true })
    if (filter) q = filter(q as any) as any
    const { count, error } = await q
    if (error) return 0
    return count || 0
  } catch {
    return 0
  }
}

export default function AdminDashboard() {
  const { loading, user } = useAuth()
  const [stats, setStats] = useState<StatBlock>(initialStats)
  const [recentBrands, setRecentBrands] = useState<BrandRow[]>([])
  const [recentEvents, setRecentEvents] = useState<EventRow[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setMsg(null)

      // --- counts (defensive: if RLS denies, we just get zeros) ---
      const [
        brandsPending,
        brandsApproved,
        eventsPending,
        eventsApproved,
        productsApproved,
        usersTotal,
        ordersTotal,
      ] = await Promise.all([
        countExact('brands', q => (q as any).eq('approved', false)),
        countExact('brands', q => (q as any).eq('approved', true)),
        countExact('events', q => (q as any).eq('status', 'pending')),
        countExact('events', q => (q as any).eq('status', 'approved')),
        countExact('products', q => (q as any).eq('approved', true)),
        countExact('profiles'),
        countExact('orders'),
      ])

      setStats({
        brandsPending,
        brandsApproved,
        eventsPending,
        eventsApproved,
        productsApproved,
        usersTotal,
        ordersTotal,
      })

      // --- recent submissions (latest 6 each) ---
      const [b, e] = await Promise.all([
        supabase
          .from('brands')
          .select('id,name,slug,approved,created_at')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('events')
          .select('id,title,slug,status,created_at')
          .order('created_at', { ascending: false })
          .limit(6),
      ])
      if (!b.error) setRecentBrands(b.data || [])
      if (!e.error) setRecentEvents(e.data || [])

      if (b.error || e.error) setMsg('Some data is not visible — are you signed in as admin?')
    })()
  }, [user])

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin — Dashboard</title></Head>

      <h1 className="text-2xl font-semibold mb-4">Admin — Dashboard</h1>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-[var(--surface)]/80 p-6">Loading…</div>
      )}

      {!loading && !user && <SignInRequiredCard nextPath="/admin" />}

      {!loading && user && (
        <>
          {/* Top stats grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Pending submissions"
              primary={stats.brandsPending + stats.eventsPending}
              lines={[
                { label: 'Brands (pending)', value: stats.brandsPending.toString() },
                { label: 'Events (pending)', value: stats.eventsPending.toString() },
              ]}
              cta={{ label: 'Review', href: '/admin/review' }}
            />
            <StatCard
              title="Approved & live"
              primary={stats.brandsApproved + stats.eventsApproved + stats.productsApproved}
              lines={[
                { label: 'Brands (approved)', value: stats.brandsApproved.toString() },
                { label: 'Events (approved)', value: stats.eventsApproved.toString() },
                { label: 'Products (approved)', value: stats.productsApproved.toString() },
              ]}
            />
            <StatCard
              title="Users & orders"
              primary={stats.usersTotal}
              lines={[
                { label: 'Users (profiles)', value: stats.usersTotal.toString() },
                { label: 'Orders (total)', value: stats.ordersTotal.toString() },
              ]}
              cta={{ label: 'Payments', href: '/admin/payments' }}
            />
          </div>

          {msg && <div className="mt-3 text-sm text-[var(--text-2)]">{msg}</div>}

          {/* Recent activity */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RecentList
              title="Recent brands"
              rows={recentBrands.map(b => ({
                id: b.id,
                title: b.name,
                slug: b.slug,
                meta: b.approved ? 'approved' : 'pending',
                href: `/brands/${b.slug}`,
              }))}
              empty="No brands yet."
              reviewHref="/admin/review"
            />
            <RecentList
              title="Recent events"
              rows={recentEvents.map(e => ({
                id: e.id,
                title: e.title,
                slug: e.slug,
                meta: e.status,
                href: `/events/${e.slug}`,
              }))}
              empty="No events yet."
              reviewHref="/admin/review?tab=events"
            />
          </div>
        </>
      )}
    </SidebarLayout>
  )
}

/* ---------- small presentational helpers ---------- */

function StatCard({
  title,
  primary,
  lines,
  cta,
}: {
  title: string
  primary: number
  lines: { label: string; value: string }[]
  cta?: { label: string; href: string }
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
      <div className="text-[var(--text-2)] text-sm">{title}</div>
      <div className="text-5xl font-semibold mt-2">{primary}</div>
      <ul className="mt-3 space-y-1 text-sm text-[var(--text-2)]">
        {lines.map((l) => (
          <li key={l.label} className="flex justify-between">
            <span>{l.label}</span><span>{l.value}</span>
          </li>
        ))}
      </ul>
      {cta && (
        <Link
          href={cta.href}
          className="inline-block mt-3 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}

function RecentList({
  title,
  rows,
  empty,
  reviewHref,
}: {
  title: string
  rows: { id: string; title: string; slug: string; meta: string; href: string }[]
  empty: string
  reviewHref: string
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        <Link href={reviewHref} className="text-sm underline">Review</Link>
      </div>
      {!rows.length && <div className="text-[var(--text-2)] text-sm">{empty}</div>}
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="font-medium truncate">{r.title}</div>
            <div className="text-xs text-[var(--text-2)] truncate">{r.slug} • {r.meta}</div>
            <div className="mt-1">
              <Link href={r.href} className="text-xs underline">Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}