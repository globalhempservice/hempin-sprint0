// pages/experiments/onboarding.tsx
import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient' // soft-dependency; guarded in try/catch

type Persona = 'consumer' | 'pro'
type StepKey = 'welcome' | 'name' | 'persona' | 'interests' | 'finish'

const INTERESTS_CONSUMER = [
  'Fashion', 'Home', 'Nutrition', 'Cosmetics', 'Pet', 'Recreation'
]
const INTERESTS_PRO = [
  'Cultivation', 'Processing', 'Manufacturing', 'Retail', 'R&D', 'Finance'
]

// simple in-page “leaf” confetti
function LeafBurst({ trigger }: { trigger: number }) {
  const [bursts, setBursts] = useState<number[]>([])
  useEffect(() => {
    if (trigger === 0) return
    const id = Math.random()
    setBursts(b => [...b, id])
    const t = setTimeout(() => {
      setBursts(b => b.filter(x => x !== id))
    }, 900)
    return () => clearTimeout(t)
  }, [trigger])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bursts.map(id => (
        <span
          key={id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        >
          {/* 8 leaves spinning outwards */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-emerald-300"
              style={{
                transform: `rotate(${(360 / 8) * i}deg) translateY(-4px)`,
                animation: `leaf-pop 900ms ease-out`
              }}
            >
              🌿
            </span>
          ))}
        </span>
      ))}
      <style jsx global>{`
        @keyframes leaf-pop {
          0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function ExperimentOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState<StepKey>('welcome')

  // form state
  const [name, setName] = useState('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // points (local only for this experiment)
  const [leafPoints, setLeafPoints] = useState<number>(0)
  const [burst, setBurst] = useState(0)

  // restore draft (localStorage) so we can iterate safely here
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hempin.onboarding.draft')
      if (raw) {
        const d = JSON.parse(raw)
        if (d.name) setName(d.name)
        if (d.persona) setPersona(d.persona)
        if (Array.isArray(d.interests)) setInterests(d.interests)
        if (d.step) setStep(d.step)
        if (typeof d.leafPoints === 'number') setLeafPoints(d.leafPoints)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const draft = { name, persona, interests, step, leafPoints }
    try { localStorage.setItem('hempin.onboarding.draft', JSON.stringify(draft)) } catch {}
  }, [name, persona, interests, step, leafPoints])

  // toggle interest chip
  const toggleInterest = (label: string) => {
    setInterests((cur) =>
      cur.includes(label) ? cur.filter(i => i !== label) : [...cur, label]
    )
  }

  const personaInterests = useMemo(
    () => (persona === 'pro' ? INTERESTS_PRO : INTERESTS_CONSUMER),
    [persona]
  )

  const earnLeaf = (n = 1) => {
    setLeafPoints(p => p + n)
    setBurst(b => b + 1)
  }

  const guardNext = () => {
    if (step === 'name' && name.trim().length < 2) {
      setError('Please tell us your name (2+ characters).')
      return false
    }
    if (step === 'persona' && !persona) {
      setError('Pick one to continue.')
      return false
    }
    if (step === 'interests' && interests.length === 0) {
      setError('Choose at least one interest.')
      return false
    }
    setError(null)
    return true
  }

  const goNext = () => {
    if (!guardNext()) return
    if (step === 'welcome') {
      earnLeaf(1) // +1: started onboarding
      setStep('name')
    } else if (step === 'name') {
      earnLeaf(1) // +1: gave a name
      setStep('persona')
    } else if (step === 'persona') {
      earnLeaf(1) // +1: chose persona
      setStep('interests')
    } else if (step === 'interests') {
      setStep('finish')
    }
  }

  const goBack = () => {
    setError(null)
    if (step === 'name') setStep('welcome')
    else if (step === 'persona') setStep('name')
    else if (step === 'interests') setStep('persona')
  }

  const handleFinish = async () => {
    setSaving(true)
    setError(null)
    try {
      // OPTIONAL: persist to Supabase (safe-guarded)
      // Requires a "profiles" table with columns:
      // id (uuid), full_name text, persona text, interests text[], onboarding_done boolean
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: name.trim(),
          persona: persona,
          interests,
          onboarding_done: true
        }, { onConflict: 'id' })
      }
      earnLeaf(2) // bonus for completion
      // clear draft on success
      try { localStorage.removeItem('hempin.onboarding.draft') } catch {}
      // keep them on experiments for now; in real flow => router.replace('/account')
      router.push('/account')
    } catch (e: any) {
      setError(e?.message || 'Could not save yet—this is just a lab demo. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Head><title>Onboarding (Lab) • HEMPIN</title></Head>

      {/* top bar (lab) */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">HI</div>
            <div className="text-sm opacity-80">Onboarding Lab</div>
          </div>
          <div className="relative">
            <span className="text-xl" aria-hidden>🌿</span>
            <span className="ml-2 text-sm opacity-80">{leafPoints}</span>
            <LeafBurst trigger={burst} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-10">
        {/* progress dots */}
        <div className="mb-6 flex items-center gap-2">
          {(['welcome','name','persona','interests','finish'] as StepKey[]).map((k, i) => (
            <div
              key={k}
              className={[
                'h-2 w-2 rounded-full',
                k === step ? 'bg-emerald-400' : 'bg-white/20'
              ].join(' ')}
              title={k}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          {step === 'welcome' && (
            <section className="space-y-4">
              <h1 className="text-2xl font-bold">Welcome to HEMPIN ✨</h1>
              <p className="opacity-80">
                A playful onboarding—two minutes. You’ll earn 🌿 points as you go.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={goNext} className="btn btn-primary">Let’s start</button>
                <a href="/" className="btn btn-outline">Maybe later</a>
              </div>
            </section>
          )}

          {step === 'name' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">What should we call you?</h2>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="input w-full"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="mt-2 flex gap-3">
                <button onClick={goBack} className="btn btn-outline">Back</button>
                <button onClick={goNext} className="btn btn-primary">Continue</button>
              </div>
            </section>
          )}

          {step === 'persona' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Which path fits you best?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setPersona('consumer')}
                  className={[
                    'rounded-xl border p-4 text-left transition',
                    persona === 'consumer'
                      ? 'border-emerald-400/40 bg-emerald-400/10'
                      : 'border-white/10 hover:bg-white/5'
                  ].join(' ')}
                >
                  <div className="font-semibold">Consumer</div>
                  <p className="text-sm opacity-75">Explore sustainable hemp lifestyle.</p>
                </button>
                <button
                  onClick={() => setPersona('pro')}
                  className={[
                    'rounded-xl border p-4 text-left transition',
                    persona === 'pro'
                      ? 'border-emerald-400/40 bg-emerald-400/10'
                      : 'border-white/10 hover:bg-white/5'
                  ].join(' ')}
                >
                  <div className="font-semibold">Professional</div>
                  <p className="text-sm opacity-75">Build brands, products & deals.</p>
                </button>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="mt-2 flex gap-3">
                <button onClick={goBack} className="btn btn-outline">Back</button>
                <button onClick={goNext} className="btn btn-primary">Continue</button>
              </div>
            </section>
          )}

          {step === 'interests' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">What are you into?</h2>
              <p className="text-sm opacity-75">Pick at least one.</p>
              <div className="flex flex-wrap gap-2">
                {personaInterests.map(label => {
                  const active = interests.includes(label)
                  return (
                    <button
                      key={label}
                      onClick={() => toggleInterest(label)}
                      className={[
                        'rounded-full px-3 py-1 text-sm border transition',
                        active
                          ? 'border-emerald-400/50 bg-emerald-400/10'
                          : 'border-white/10 hover:bg-white/5'
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="mt-2 flex gap-3">
                <button onClick={goBack} className="btn btn-outline">Back</button>
                <button onClick={goNext} className="btn btn-primary">Continue</button>
              </div>
            </section>
          )}

          {step === 'finish' && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">You’re set, {name || 'friend'}! 🎉</h2>
              <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                <li>Persona: <span className="opacity-100">{persona}</span></li>
                <li>Interests: <span className="opacity-100">{interests.join(', ') || '—'}</span></li>
                <li>🌿 Points earned: <span className="opacity-100">{leafPoints}</span></li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => earnLeaf(1)} className="btn btn-outline">+1 leaf (demo)</button>
                <button onClick={handleFinish} className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Go to my account'}
                </button>
                <a href="/" className="btn btn-ghost">Skip for now</a>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </section>
          )}
        </div>

        {/* tiny help text */}
        <p className="mt-6 text-center text-xs opacity-60">
          Lab build: stores a draft in your browser. On real rollout, we’ll fully persist to Supabase profiles.
        </p>
      </main>
    </div>
  )
}