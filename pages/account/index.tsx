import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'
import { loadDraftBrand, saveDraftBrand, type DraftBrand } from '../../lib/draftBrand'

export default function Account() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Draft state (guest can edit; signed-in can still see the preview wired to their brand later)
  const [draft, setDraft] = useState<DraftBrand>(() => loadDraftBrand())
  useEffect(() => {
    saveDraftBrand(draft)
  }, [draft])

  // Auth probe (no redirect here — guests are allowed)
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    })()
  }, [])

  // “Save & continue” -> magic link
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const siteUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, ''),
    []
  )

  const sendMagic = async () => {
    if (!email) return
    setSending(true)
    try {
      // Keep draft in localStorage; user returns to /account
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${siteUrl || window.location.origin}/account` },
      })
      if (error) throw error
      setSent(true)
    } catch (e: any) {
      alert(e?.message || 'Failed to send magic link')
    } finally {
      setSending(false)
    }
  }

  const checklistItems = [
    { label: 'Create your brand basics', href: '/account/brand' },
    { label: 'Upload a hero image & logo', href: '/account/brand' },
    { label: 'Write your brand story', href: '/account/brand' },
    { label: 'Add at least 1 product page', href: '/account/products' },
    { label: 'Choose your kit or slots', href: '/services' },
  ]

  return (
    <main className="container space-y-6">
      {/* Header band */}
      <div className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs opacity-70">Welcome</div>
          <h1 className="text-2xl font-bold">
            Let’s build your brand presence <span className="inline-block">🌿</span>
          </h1>
          <p className="opacity-80">
            Your dashboard updates live as you edit your brand or make purchases.
          </p>
        </div>
        <button className="btn btn-success" onClick={() => router.push('/services')}>
          Get a kit / slots
        </button>
      </div>

      {/* Guest banner */}
      {!loading && !user && (
        <div className="card border border-yellow-500/30 bg-yellow-500/5">
          <div className="font-medium mb-1">You’re exploring in guest mode.</div>
          <p className="opacity-80">
            Play with the live preview below. When you’re ready to save, enter your email and
            we’ll send you a magic link. Your draft stays on this device until you sign in.
          </p>
        </div>
      )}

      {/* Checklist + live preview */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Checklist */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Your launch checklist</h2>
            <span className="text-xs opacity-70">0/5 complete</span>
          </div>
          <ul className="space-y-2">
            {checklistItems.map((it) => (
              <li
                key={it.label}
                className="flex items-center justify-between rounded px-2 py-1 hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span>{it.label}</span>
                </div>
                <a className="link" href={it.href}>
                  Open
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Live preview */}
        <div className="card">
          <h2 className="font-semibold mb-3">Live preview</h2>

          <div className="rounded-lg bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 mb-3">
            <div className="rounded-lg bg-black/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div>
                  <div className="font-semibold">
                    {draft.name || 'Your Brand Name'}
                  </div>
                  <div className="text-xs opacity-70">
                    {draft.category ? draft.category.toUpperCase() : 'CATEGORY'}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm opacity-90">
                {draft.description ||
                  'Write a short, strong description about your mission, materials and what makes your brand special.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => router.push('/account/brand')}>
              Edit brand
            </button>
            <button className="btn btn-primary" onClick={() => router.push('/brand')}>
              Preview public page
            </button>
          </div>
        </div>
      </section>

      {/* Draft form + Save & continue (guest) */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Draft brand (guest + signed-in) */}
        <div className="card">
          <h3 className="font-semibold mb-3">
            Draft your brand {user ? '' : <span className="opacity-70">(no account yet)</span>}
          </h3>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Brand name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Category (e.g., Fashion, Beauty…)"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <textarea
              className="textarea"
              rows={5}
              placeholder="Short description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <p className="text-xs opacity-70">
              This preview updates automatically as you type (stored on this device).
            </p>
          </div>
        </div>

        {/* Save & continue block (only meaningful for guests) */}
        <div className="card">
          <h3 className="font-semibold mb-3">Save & continue</h3>
          {user ? (
            <div className="opacity-80">
              You’re signed in. Continue editing your brand, add products, or{' '}
              <a className="link" href="/services">get a kit</a>.
            </div>
          ) : (
            <>
              <p className="opacity-80 mb-3">
                Enter your email to receive a magic link. We’ll attach your draft to your account
                automatically when you return.
              </p>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendMagic} disabled={sending || sent}>
                  {sent ? 'Link sent' : sending ? 'Sending…' : 'Send magic link'}
                </button>
              </div>
              <p className="text-xs opacity-70 mt-2">
                We never share your email. You can finish later — your draft stays on this device.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}