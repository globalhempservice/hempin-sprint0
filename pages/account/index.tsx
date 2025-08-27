// pages/account/index.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AppShell from '../../components/AppShell'
import AccountProgress from '../../components/AccountProgress'
import BrandPreviewCard from '../../components/BrandPreviewCard'

export default function AccountHome() {
  const [email, setEmail] = useState<string | null>(null)
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email ?? null)
      if (user) {
        // Try to fetch a brand owned by this user (adjust column name if different in your schema)
        const { data } = await supabase
          .from('brands')
          .select('name,description,category,website_url,hero_image_url,logo_url,slug')
          .eq('owner_id', user.id)
          .maybeSingle()
        setBrand(data || null)
      }
      setLoading(false)
    })()
  }, [])

  const tasks = [
    { label: 'Create your brand basics', done: !!brand?.name, href: '/account/brand' },
    { label: 'Upload a hero image & logo', done: !!brand?.hero_image_url && !!brand?.logo_url, href: '/account/brand' },
    { label: 'Write your brand story', done: !!brand?.description, href: '/account/brand' },
    { label: 'Add at least 1 product page', done: false, href: '/account/products' },
    { label: 'Choose your kit or slots', done: false, href: '/shop' },
  ]

  return (
    <AppShell>
      <Head>
        <title>Account — Hemp’in</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Welcome hero inside account */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm text-zinc-400">Welcome{email ? `, ${email}` : ''}</div>
              <h1 className="text-2xl md:text-3xl font-semibold mt-1">Let’s build your brand presence 🌿</h1>
              <p className="text-zinc-400 mt-2">Complete the steps below and you’ll be ready for our Bangkok launch.</p>
            </div>
            <a href="/shop" className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400">
              Get a kit / slots
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <AccountProgress items={tasks} />
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="text-lg font-semibold">Quick links</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a href="/account/brand" className="rounded-lg border border-zinc-800 hover:border-zinc-600 px-3 py-2 text-sm">Edit brand</a>
                <a href="/account/billing" className="rounded-lg border border-zinc-800 hover:border-zinc-600 px-3 py-2 text-sm">Billing & entitlements</a>
                <a href="/account/products" className="rounded-lg border border-zinc-800 hover:border-zinc-600 px-3 py-2 text-sm">Products (test)</a>
                <a href="/shop" className="rounded-lg border border-zinc-800 hover:border-zinc-600 px-3 py-2 text-sm">Shop</a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">Live preview</h3>
            <BrandPreviewCard brand={brand} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
