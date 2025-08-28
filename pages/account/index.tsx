// pages/account/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { loadGuestDraft, saveGuestDraft, clearGuestDraft } from '../../lib/guestDraft'
import BrandPreviewCard from '../../components/BrandPreviewCard'
import { LaunchChecklist } from '../../components/LaunchChecklist'
import Link from 'next/link'

type BrandRow = {
  id: string
  name: string | null
  tagline: string | null
  description: string | null
  category: string | null
  hero_url?: string | null
}

export default function AccountDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [brand, setBrand] = useState<BrandRow | null>(null)
  const [guest, setGuest] = useState(loadGuestDraft())
  const [email, setEmail] = useState('')

  // Load session + brand (if signed in)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      if (user?.id) {
        const { data } = await supabase.from('brands')
          .select('id,name,tagline,description,category,hero_url')
          .eq('owner_id', user.id).maybeSingle()
        setBrand(data as any || null)

        // If there’s a guest draft, merge it once
        const draft = loadGuestDraft()
        if (draft && (draft.name || draft.description || draft.category || draft.heroUrl)) {
          await fetch('/api/merge-guest-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, draft })
          })
          clearGuestDraft()
          setGuest({})
          const { data: fresh } = await supabase.from('brands')
            .select('id,name,tagline,description,category,hero_url')
            .eq('owner_id', user.id).maybeSingle()
          setBrand(fresh as any || null)
        }
      }
    })()
  }, [])

  // Compose the “source of truth” for preview + checklist
  const model = useMemo(() => {
    if (brand) {
      return {
        name: brand.name ?? '',
        tagline: brand.tagline ?? '',
        description: brand.description ?? '',
        category: brand.category ?? '',
        heroUrl: brand.hero_url ?? undefined,
        hasProduct: false, // TODO: compute from your real products
      }
    }
    return guest
  }, [brand, guest])

  // Checklist
  const items = useMemo(() => {
    return [
      { label: 'Create your brand basics', done: !!model.name, href: '/account/brand' },
      { label: 'Upload a hero image & logo', done: !!model.heroUrl, href: '/account/brand' },
      { label: 'Write your brand story', done: !!model.description && model.description.length > 30, href: '/account/brand' },
      { label: 'Add at least 1 product page', done: !!model.hasProduct, href: '/account/products' },
      { label: 'Choose your kit or slots', done: false, href: '/shop' },
    ]
  }, [model])

  // Guest form handlers
  function handleGuestChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    const patch: any = { [name]: value }
    setGuest(prev => ({ ...prev, ...patch }))
    saveGuestDraft(patch)
  }

  async function sendMagicLink() {
    if (!email) return
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/account` }})
    alert('Check your email for a magic link.')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header row */}
      <div className="rounded-2xl border p-6 mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-400 mb-1">Welcome</div>
          <h1 className="text-3xl font-bold">Let’s build your brand presence <span className="ml-1">🌿</span></h1>
          <p className="text-neutral-400 mt-2">Your dashboard updates live as you edit your brand or make purchases.</p>
        </div>
        <Link href="/shop" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
          Get a kit / slots
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Checklist */}
        <LaunchChecklist items={items as any} />

        {/* Live preview */}
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Live preview</h2>
          <BrandPreviewCard
            name={model.name}
            category={model.category}
            description={model.description}
            heroUrl={model.heroUrl}
          />
          <div className="mt-4 flex gap-3">
            <Link href="/account/brand" className="px-4 py-2 rounded-lg border hover:bg-white/5">Edit brand</Link>
            <button className="px-4 py-2 rounded-lg border hover:bg-white/5">Preview public page</button>
          </div>
          <p className="text-xs text-neutral-500 mt-3">This preview updates automatically when you edit your brand.</p>
        </div>
      </div>

      {/* If not signed in: show guest editor + magic link */}
      {!userId && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold mb-3">Draft your brand (no account yet)</h3>
            <div className="space-y-3">
              <input
                className="w-full rounded-md bg-neutral-900 border px-3 py-2"
                name="name" placeholder="Brand name" value={guest.name || ''} onChange={handleGuestChange}
              />
              <input
                className="w-full rounded-md bg-neutral-900 border px-3 py-2"
                name="category" placeholder="Category (e.g., Fashion, Beauty…)" value={guest.category || ''} onChange={handleGuestChange}
              />
              <textarea
                className="w-full rounded-md bg-neutral-900 border px-3 py-2"
                name="description" placeholder="Short description" rows={4} value={guest.description || ''} onChange={handleGuestChange}
              />
              <input
                className="w-full rounded-md bg-neutral-900 border px-3 py-2"
                name="heroUrl" placeholder="Hero image URL (optional)" value={guest.heroUrl || ''} onChange={handleGuestChange}
              />
            </div>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold mb-3">Save & continue</h3>
            <p className="text-sm text-neutral-400 mb-3">
              Enter your email to receive a magic link. We’ll attach your draft to your account automatically.
            </p>
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-md bg-neutral-900 border px-3 py-2"
                placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
              />
              <button onClick={sendMagicLink} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
                Send magic link
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">We never share your email. You can finish later—your draft stays on this device.</p>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold mb-3">Quick links</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/account/brand" className="rounded-lg border px-4 py-3 hover:bg-white/5">Edit brand</Link>
            <Link href="/account/billing" className="rounded-lg border px-4 py-3 hover:bg-white/5">Billing & entitlements</Link>
            <Link href="/account/products" className="rounded-lg border px-4 py-3 hover:bg-white/5">Products (test)</Link>
            <Link href="/shop" className="rounded-lg border px-4 py-3 hover:bg-white/5">Shop</Link>
          </div>
        </div>
      </div>
    </div>
  )
}