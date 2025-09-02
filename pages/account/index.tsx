import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../components/SidebarLayout'
import { supabase } from '../../lib/supabaseClient'

type Brand = {
  id: string
  name: string
  slug: string
  approved: boolean
  featured: boolean | null
  logo_url: string | null
}

type Counts = {
  brands_total: number
  brands_pending: number
  products_total: number
  products_pending: number
  events_total: number
  events_pending: number
}

export default function AccountHome() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [counts, setCounts] = useState<Counts>({
    brands_total: 0, brands_pending: 0,
    products_total: 0, products_pending: 0,
    events_total: 0, events_pending: 0
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      // who am i
      const { data: u } = await supabase.auth.getUser()
      const uid = u?.user?.id || null
      setUserEmail(u?.user?.email || '')

      if (!uid) { setLoading(false); return }

      // my brands
      const b = await supabase
        .from('brands')
        .select('id,name,slug,approved,featured,logo_url')
        .eq('owner_id', uid)
        .order('created_at', { ascending: false })
      const myBrands = b.data || []
      setBrands(myBrands)

      const brandIds = myBrands.map(x => x.id)
      const hasBrandIds = brandIds.length > 0

      // brand counts
      const { count: brands_total } = await supabase
        .from('brands').select('id', { count: 'exact', head: true }).eq('owner_id', uid)
      const { count: brands_pending } = await supabase
        .from('brands').select('id', { count: 'exact', head: true }).eq('owner_id', uid).eq('approved', false)

      // product counts (by my brand ids)
      let products_total = 0, products_pending = 0
      if (hasBrandIds) {
        const all = await supabase
          .from('products').select('id', { count: 'exact', head: true }).in('brand_id', brandIds)
        const pend = await supabase
          .from('products').select('id', { count: 'exact', head: true }).in('brand_id', brandIds).eq('approved', false)
        products_total = all.count || 0
        products_pending = pend.count || 0
      }

      // events counts (owner_profile_id used in your schema)
      const { count: events_total } = await supabase
        .from('events').select('id', { count: 'exact', head: true }).eq('owner_profile_id', uid)
      const { count: events_pending } = await supabase
        .from('events').select('id', { count: 'exact', head: true }).eq('owner_profile_id', uid).eq('status', 'pending')

      setCounts({
        brands_total: brands_total || 0,
        brands_pending: brands_pending || 0,
        products_total,
        products_pending,
        events_total: events_total || 0,
        events_pending: events_pending || 0
      })

      setLoading(false)
    })()
  }, [])

  const hasAnything = useMemo(
    () => counts.brands_total + counts.products_total + counts.events_total > 0,
    [counts]
  )

  return (
    <SidebarLayout variant="account">
      <Head><title>Account • HEMPIN</title></Head>

      <div className="grid gap-6">
        {/* Greeting & quick intent */}
        <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(28,35,33,.5),rgba(20,23,22,.4))] backdrop-blur p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Account home</h1>
              <p className="text-[var(--text-2)]">Signed in as {userEmail || '—'}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/account/brand" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">My Brand</Link>
              <Link href="/account/products" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">My Products</Link>
              <Link href="/account/events" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">My Events</Link>
            </div>
          </div>

          {!hasAnything && !loading && (
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="font-medium">Let’s plant your first seed.</div>
              <p className="text-sm text-[var(--text-2)]">Create a brand to unlock products, events, and more.</p>
              <div className="mt-3 flex gap-2">
                <Link href="/account/brand" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">Create brand</Link>
                <Link href="/supermarket" className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10">Explore marketplace</Link>
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-3 gap-4">
          <Tile
            title="Brands"
            primary={counts.brands_total}
            subtitle={`${counts.brands_pending} pending`}
            href="/account/brand"
          />
          <Tile
            title="Products"
            primary={counts.products_total}
            subtitle={`${counts.products_pending} pending`}
            href="/account/products"
          />
          <Tile
            title="Events"
            primary={counts.events_total}
            subtitle={`${counts.events_pending} pending`}
            href="/account/events"
          />
        </section>

        {/* My brands preview */}
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Your brands</h2>
            <Link href="/account/brand" className="text-sm underline">Manage</Link>
          </div>

          {loading && <div className="text-sm text-[var(--text-2)]">Loading…</div>}

          {!loading && !brands.length && (
            <div className="text-sm text-[var(--text-2)]">You don’t have any brands yet.</div>
          )}

          {!!brands.length && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brands.slice(0, 6).map(b => (
                <li key={b.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <a href={`/brands/${b.slug}`} className="flex items-center gap-3">
                    {b.logo_url ? (
                      <img src={b.logo_url} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.name}</div>
                      <div className="text-xs text-[var(--text-2)]">
                        {b.approved ? 'approved' : 'pending'}{b.featured ? ' • featured' : ''}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Helpful shortcuts */}
        <section className="grid md:grid-cols-3 gap-4">
          <Shortcut
            title="Create a product"
            desc="Add a new SKU under your brand."
            href="/account/products"
          />
          <Shortcut
            title="Create an event"
            desc="List a fair, meetup, or showcase."
            href="/account/events"
          />
          <Shortcut
            title="Supermarket"
            desc="See how your brand appears to the world."
            href="/supermarket"
          />
        </section>
      </div>
    </SidebarLayout>
  )
}

function Tile({ title, primary, subtitle, href }: { title: string; primary: number | string; subtitle?: string; href: string }) {
  return (
    <a href={href} className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4 block hover:bg-white/10 transition">
      <div className="text-sm text-[var(--text-2)] mb-1">{title}</div>
      <div className="text-3xl font-semibold">{primary}</div>
      {subtitle && <div className="text-xs text-[var(--text-2)] mt-1">{subtitle}</div>}
    </a>
  )
}

function Shortcut({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a href={href} className="rounded-2xl p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition block">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-[var(--text-2)]">{desc}</div>
      <div className="text-sm mt-2 underline">Open →</div>
    </a>
  )
}