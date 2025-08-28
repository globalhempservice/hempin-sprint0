[PASTE THE account/index.tsx CONTENT HERE]
// pages/account/index.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useUser } from '../../lib/useUser'
import AccountSidebar from '../../components/AccountSidebar'

export default function Account() {
  const { ready, user } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // guest draft storage
  const [draft, setDraft] = useState({ name: '', category: '', summary: '' })
  useEffect(() => {
    if (!user) {
      try {
        const raw = localStorage.getItem('guest_brand_draft')
        if (raw) setDraft(JSON.parse(raw))
      } catch {}
    }
  }, [user])
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_brand_draft', JSON.stringify(draft))
    }
  }, [draft, user])

  const checklist = useMemo(() => {
    const items = [
      { key: 'basics',  label: 'Create your brand basics',        done: !!draft.name },
      { key: 'hero',    label: 'Upload a hero image & logo',      done: false },
      { key: 'story',   label: 'Write your brand story',           done: !!draft.summary },
      { key: 'product', label: 'Add at least 1 product page',     done: false },
      { key: 'kit',     label: 'Choose your kit or slots',         done: false },
    ]
    const completed = items.filter(i => i.done).length
    return { items, completed, total: items.length }
  }, [draft.name, draft.summary])

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const sendMagic = async () => {
    if (!email) return
    setSending(true)
    const redirect = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE || window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${redirect}/account` },
    })
    setSending(false)
    if (error) alert(error.message)
    else alert('Magic link sent! Check your inbox.')
  }

  return (
    <>
      <AccountSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} userEmail={user?.email ?? null} />

      <main className="container space-y-6">
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur supports-[backdrop-filter]:bg-black/30 py-3">
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
            <div className="ml-auto">
              <a className="btn btn-primary" href="/services">Get a kit / slots</a>
            </div>
          </div>
        </div>

        <section className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm opacity-70">Welcome</div>
              <h1 className="text-3xl font-bold">Let’s build your brand presence 🌿</h1>
              <p className="opacity-80">Your dashboard updates live as you edit your brand or make purchases.</p>
            </div>
            <a className="btn btn-primary" href="/services">Get a kit / slots</a>
          </div>
          {!user && ready && (
            <div className="mt-4 rounded-lg border border-white/10 p-4 bg-white/5">
              <div className="font-medium mb-1">You’re exploring in guest mode.</div>
              <p className="text-sm opacity-80">
                Play with the live preview below. When you’re ready to save, enter your email and we’ll send you a magic link.
                Your draft stays on this device until you sign in.
              </p>
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Your launch checklist</h2>
              <div className="text-sm opacity-70">{checklist.completed}/{checklist.total} complete</div>
            </div>
            <ul className="grid gap-2">
              {checklist.items.map(it => (
                <li key={it.key} className="flex items-center justify-between rounded-md px-3 py-2 bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${it.done ? 'bg-emerald-500' : 'bg-white/30'}`} />
                    <span>{it.label}</span>
                  </div>
                  <a className="text-emerald-400 hover:underline" href={
                    it.key === 'product' ? '/account/products' :
                    it.key === 'kit' ? '/services' : '/brand'
                  }>
                    Open
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="font-semibold mb-3">Live preview</h2>
            <div className="rounded-lg bg-gradient-to-b from-white/5 to-white/0 border border-white/10 p-4">
              <div className="text-sm opacity-70 mb-1">{draft.category || 'CATEGORY'}</div>
              <div className="text-xl font-semibold">{draft.name || 'Your Brand Name'}</div>
              <p className="opacity-80 mt-2">
                {draft.summary || 'Write a short, strong description about your mission, materials and what makes your brand special.'}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <a className="btn btn-outline" href="/brand">Edit brand</a>
              <a className="btn btn-primary" href="/brand">Preview public page</a>
            </div>
          </section>

          <section className="card">
            <h3 className="font-medium mb-2">Draft your brand {user ? '' : '(no account yet)'}</h3>
            <div className="grid gap-2">
              <input
                className="input"
                placeholder="Brand name"
                value={draft.name}
                onChange={e => setDraft(s => ({ ...s, name: e.target.value }))}
              />
              <input
                className="input"
                placeholder="Category (e.g., Fashion, Beauty…)"
                value={draft.category}
                onChange={e => setDraft(s => ({ ...s, category: e.target.value }))}
              />
              <textarea
                className="input h-32"
                placeholder="Short description"
                value={draft.summary}
                onChange={e => setDraft(s => ({ ...s, summary: e.target.value }))}
              />
              {!user && <p className="text-xs opacity-60">This preview updates automatically as you type (stored on this device).</p>}
            </div>
          </section>

          <section className="card">
            <h3 className="font-medium mb-2">{user ? 'Signed in' : 'Save & continue'}</h3>
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm opacity-70">You’re signed in. Use the menu to explore.</div>
                </div>
                <button className="btn btn-outline" onClick={async () => { await supabase.auth.signOut(); location.reload() }}>
                  Log out
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm opacity-80 mb-2">
                  Enter your email to receive a magic link. We’ll attach your draft to your account automatically when you return.
                </p>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={sendMagic} disabled={sending}>
                    {sending ? 'Sending…' : 'Send magic link'}
                  </button>
                </div>
                <p className="text-xs opacity-60 mt-2">We never share your email. You can finish later—your draft stays on this device.</p>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  )
}