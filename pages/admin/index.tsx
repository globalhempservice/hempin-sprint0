// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import SidebarLayout from '../../components/SidebarLayout'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'
import { useEffect, useState } from 'react'

type BrandLite = { id: string; name: string; slug: string; approved: boolean }
type EventLite = { id: string; title: string; slug: string; status: 'pending'|'approved'|'rejected' }
type ProductLite = { id: string; name: string; slug: string; approved: boolean; price_label?: string|null }

type DashboardPayload = {
  pending: { brands: number; events: number; products: number }
  approved: { brands: number; events: number; products: number }
  recent: { brands: BrandLite[]; events: EventLite[]; products: ProductLite[] }
}

export default function AdminHome() {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const r = await fetch('/api/admin/dashboard').then(r => r.json()).catch(() => null)
      setData(r)
      setLoading(false)
    })()
  }, [])

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin — Dashboard</title></Head>
      <h1 className="text-2xl font-semibold mb-4">Admin — Dashboard</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pending */}
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
          <div className="text-sm text-[var(--text-2)] mb-2">Pending submissions</div>
          {loading || !data ? (
            <div className="text-4xl font-semibold">—</div>
          ) : (
            <div className="text-4xl font-semibold">
              {(data.pending.brands ?? 0) + (data.pending.events ?? 0) + (data.pending.products ?? 0)}
            </div>
          )}
          <div className="mt-2 text-sm text-[var(--text-2)] space-y-1">
            <div>Brands (pending) <span className="float-right">{data?.pending.brands ?? 0}</span></div>
            <div>Events (pending) <span className="float-right">{data?.pending.events ?? 0}</span></div>
            <div>Products (pending) <span className="float-right">{data?.pending.products ?? 0}</span></div>
          </div>
          <Link href="/admin/review" className="mt-3 inline-block px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">Review</Link>
        </section>

        {/* Approved */}
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
          <div className="text-sm text-[var(--text-2)] mb-2">Approved & live</div>
          {loading || !data ? (
            <div className="text-4xl font-semibold">—</div>
          ) : (
            <div className="text-4xl font-semibold">
              {(data.approved.brands ?? 0) + (data.approved.events ?? 0) + (data.approved.products ?? 0)}
            </div>
          )}
          <div className="mt-2 text-sm text-[var(--text-2)] space-y-1">
            <div>Brands (approved) <span className="float-right">{data?.approved.brands ?? 0}</span></div>
            <div>Events (approved) <span className="float-right">{data?.approved.events ?? 0}</span></div>
            <div>Products (approved) <span className="float-right">{data?.approved.products ?? 0}</span></div>
          </div>
        </section>

        {/* Users & orders – unchanged placeholder */}
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
          <div className="text-sm text-[var(--text-2)] mb-2">Users & orders</div>
          <div className="text-4xl font-semibold">6</div>
          <div className="mt-2 text-sm text-[var(--text-2)] space-y-1">
            <div>Users (profiles) <span className="float-right">6</span></div>
            <div>Orders (total) <span className="float-right">2</span></div>
          </div>
          <Link href="/admin/payments" className="mt-3 inline-block px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">Payments</Link>
        </section>
      </div>

      {/* Recent rows */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent brands</h2>
            <Link className="text-sm underline" href="/admin/review">Review</Link>
          </div>
          <ul className="grid gap-2">
            {(data?.recent.brands || []).map(b => (
              <li key={b.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-[var(--text-2)]">{b.slug} • {b.approved ? 'approved' : 'pending'}</div>
                <a className="text-sm underline" href={`/brands/${b.slug}`} target="_blank" rel="noreferrer">Open</a>
              </li>
            ))}
            {!data?.recent.brands?.length && <div className="text-sm text-[var(--text-2)]">No items.</div>}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent events</h2>
            <Link className="text-sm underline" href="/admin/review">Review</Link>
          </div>
          <ul className="grid gap-2">
            {(data?.recent.events || []).map(e => (
              <li key={e.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-[var(--text-2)]">{e.slug} • {e.status}</div>
                <a className="text-sm underline" href={`/events/${e.slug}`} target="_blank" rel="noreferrer">Open</a>
              </li>
            ))}
            {!data?.recent.events?.length && <div className="text-sm text-[var(--text-2)]">No items.</div>}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Recent products</h2>
            <Link className="text-sm underline" href="/admin/review">Review</Link>
          </div>
          <ul className="grid gap-2">
            {(data?.recent.products || []).map(p => (
              <li key={p.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-[var(--text-2)]">{p.slug} • {p.approved ? 'approved' : 'pending'} • {p.price_label || '—'}</div>
                <a className="text-sm underline" href={`/products/${p.slug}`} target="_blank" rel="noreferrer">Open</a>
              </li>
            ))}
            {!data?.recent.products?.length && <div className="text-sm text-[var(--text-2)]">No items.</div>}
          </ul>
        </section>
      </div>
    </SidebarLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}