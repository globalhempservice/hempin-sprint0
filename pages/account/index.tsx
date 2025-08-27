// pages/account/index.tsx
import Head from 'next/head'
import AppShell from '../../components/AppShell'
import AccountProgress from '../../components/AccountProgress'
import BrandPreviewCard from '../../components/BrandPreviewCard'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useBrand } from '../../lib/useBrand'

type Entitlements = {
  brand_page: boolean
  product_slots: number
  popup_bkk_2025: boolean
  popup_extras: number
}

export default function AccountHome() {
  const [email, setEmail] = useState<string | null>(null)
  const { brand } = useBrand()
  const [ent, setEnt] = useState<Entitlements | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let sub: any
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email ?? null)
      if (user) {
        // entitlements initial
        const { data } = await supabase
          .from('entitlements')
          .select('brand_page,product_slots,popup_bkk_2025,popup_extras')
          .eq('user_id', user.id)
          .maybeSingle()
        setEnt((data as any) ?? { brand_page:false, product_slots:0, popup_bkk_2025:false, popup_extras:0 })

        // realtime on entitlements for this user
        sub = supabase
          .channel('entitlements-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'entitlements',
            filter: `user_id=eq.${user.id}`,
          }, (payload) => {
            if (payload.eventType === 'DELETE') setEnt({ brand_page:false, product_slots:0, popup_bkk_2025:false, popup_extras:0 })
            else setEnt(payload.new as any)
          })
          .subscribe()
      }
      setLoading(false)
    })()

    return () => { if (sub) supabase.removeChannel(sub) }
  }, [])

  const tasks = useMemo(() => {
    return [
      { label: 'Create your brand basics', done: !!brand?.name, href: '/account/brand' },
      { label: 'Upload a hero image & logo', done: !!brand?.hero_image_url && !!brand?.logo_url, href: '/account/brand' },
      { label: 'Write your brand story', done: !!brand?.description, href: '/account/brand' },
      { label: 'Add at least 1 product page', done: (ent?.product_slots ?? 0) > 0, href: '/account/products' },
      { label: 'Choose your kit or slots', done: !!ent?.brand_page || !!ent?.popup_bkk_2025 || (ent?.product_slots ?? 0) > 0, href: '/shop' },
    ]
  }, [brand, ent])

  return (
    <AppShell>
      <Head><title>Account — Hemp’in</title></Head>

      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm text-zinc-400">Welcome{email ? `, ${email}` : ''}</div>
              <h1 className="text-2xl md:text-3xl font-semibold mt-1">Let’s build your brand presence 🌿</h1>
              <p className="text-zinc-400 mt-2">Your dashboard updates live as you edit your brand or make purchases.</p>
            </div>
            <a href="/shop" className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400">
              Get a kit / slots
            </a>
          </div>
        </div>

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
            <div className="mt-3 text-xs text-zinc-500">This preview updates automatically when you edit your brand.</div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
