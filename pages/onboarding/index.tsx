// pages/onboarding/index.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

type ModulesState = {
  farm: boolean
  factory: boolean
  brand: boolean
  research: boolean
  events: boolean
}

export default function Onboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<1 | 2>(1)
  const [displayName, setDisplayName] = useState('')
  const [track, setTrack] = useState<'consumer' | 'pro' | null>(null)
  const [modules, setModules] = useState<ModulesState>({
    farm: false, factory: false, brand: false, research: false, events: false
  })
  const canNext = useMemo(() => displayName.trim().length >= 2 && !!track, [displayName, track])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data?.session) {
        router.replace('/signin?next=/onboarding')
        return
      }
      // Prefill name from profile if present
      const { data: p } = await supabase.from('profiles').select('display_name').eq('id', data.session.user.id).single()
      if (p?.display_name) setDisplayName(p.display_name)
      setLoading(false)
    })
  }, [router])

  async function saveAndFinish() {
    setLoading(true)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const uid = sess?.session?.user?.id
      if (!uid) {
        router.replace('/signin?next=/onboarding'); return
      }

      // 1) Update profile display_name
      await supabase.from('profiles').upsert({
        id: uid,
        display_name: displayName.trim(),
      }, { onConflict: 'id' })

      // 2) Update entitlements meta.modules
      const { data: entRow } = await supabase.from('entitlements').select('meta').eq('user_id', uid).maybeSingle()
      const current = entRow?.meta?.modules || {}
      const nextModules = { ...current, ...modules }

      if (entRow) {
        await supabase.from('entitlements').update({ meta: { ...(entRow.meta || {}), modules: nextModules } }).eq('user_id', uid)
      } else {
        await supabase.from('entitlements').insert({ user_id: uid, meta: { modules: nextModules } })
      }

      // 3) Redirect to profile mothership ✨
      router.replace('/account/profile')
    } catch (e) {
      console.warn('Onboarding save failed', e)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-content-center">
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Onboarding • HEMPIN</title>
      </Head>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex items-center gap-2 text-sm opacity-70">
          <span className={step === 1 ? 'opacity-100' : 'opacity-60'}>Step 1</span>
          <span>•</span>
          <span className={step === 2 ? 'opacity-100' : 'opacity-60'}>Step 2</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-semibold">Welcome. Let’s set up your profile.</h1>
              <p className="mt-2 text-[var(--text-2)]">Pick a display name and tell us how you’ll use HEMPIN.</p>

              <label className="mt-6 block text-sm opacity-80">Display name</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400/40"
                placeholder="e.g. GreenSmith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <label className="mt-6 block text-sm opacity-80">I’m primarily a…</label>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => setTrack('consumer')}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    track === 'consumer'
                      ? 'border-emerald-400/40 bg-emerald-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">Consumer / Enthusiast</div>
                  <div className="text-sm opacity-75">Explore products, events, and experiments.</div>
                </button>
                <button
                  onClick={() => setTrack('pro')}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    track === 'pro'
                      ? 'border-emerald-400/40 bg-emerald-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">Pro / Organization</div>
                  <div className="text-sm opacity-75">Enable tools for brands, suppliers, and research.</div>
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  disabled={!canNext}
                  onClick={() => setStep(2)}
                  className={`rounded-xl px-5 py-3 font-medium ${
                    canNext
                      ? 'border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20'
                      : 'cursor-not-allowed border border-white/10 bg-white/5 opacity-60'
                  }`}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-semibold">Enable universes</h1>
              <p className="mt-2 text-[var(--text-2)]">
                You can change this later in your profile. Enabling a module adds its tools to your mothership.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {([
                  ['farm','Farm — cultivation logs'],
                  ['factory','Factory — processing tools'],
                  ['brand','Brand — storefront & products'],
                  ['research','Research — orgs & studies'],
                  ['events','Events — ticketing & listings'],
                ] as [keyof ModulesState, string][]).map(([k, label]) => {
                  const enabled = modules[k]
                  return (
                    <button
                      key={k}
                      onClick={() => setModules(m => ({ ...m, [k]: !m[k] }))}
                      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
                        enabled
                          ? 'border-emerald-400/40 bg-emerald-400/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`ml-3 inline-block h-3 w-3 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
                  ← Back
                </button>
                <button onClick={saveAndFinish} className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-medium hover:bg-emerald-400/20">
                  Finish & go to profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}