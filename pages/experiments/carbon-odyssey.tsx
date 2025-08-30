// pages/experiments/carbon-odyssey.tsx
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

type World = {
  health: number   // how well the biosphere is doing
  biomass: number  // proxy for green cover / soil / hemp forests
  emissions: number // proxy for fossil activity / pollution
  happiness: number // playful composite shown to user
  updatedAt: number // epoch ms
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const LS_KEY = 'odyssey.world.v1'
const LS_LAST_NUDGE = 'odyssey.lastNudge'

function loadWorld(): World {
  if (typeof window === 'undefined') {
    return { health: 60, biomass: 55, emissions: 45, happiness: 58, updatedAt: Date.now() }
  }
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) throw new Error('no world')
    const w = JSON.parse(raw) as World
    // safety clamp
    return {
      health: clamp(w.health),
      biomass: clamp(w.biomass),
      emissions: clamp(w.emissions),
      happiness: clamp(w.happiness),
      updatedAt: w.updatedAt || Date.now(),
    }
  } catch {
    const base: World = { health: 60, biomass: 55, emissions: 45, happiness: 58, updatedAt: Date.now() }
    localStorage.setItem(LS_KEY, JSON.stringify(base))
    return base
  }
}

function saveWorld(w: World) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(w))
}

function humanDate(ts: number) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ''
  }
}

/** Gentle daily drift toward a balanced attractor so the world feels “alive”. */
function naturalDrift(w: World): World {
  // target equilibrium
  const target = { health: 62, biomass: 58, emissions: 42, happiness: 60 }
  const now = Date.now()
  // time-based small t (drift stronger if you come back after a while)
  const hours = Math.min(24, (now - (w.updatedAt || now)) / (1000 * 60 * 60))
  const t = Math.min(0.12, hours / 200) // very subtle
  const next: World = {
    health: clamp(lerp(w.health, target.health, t)),
    biomass: clamp(lerp(w.biomass, target.biomass, t)),
    emissions: clamp(lerp(w.emissions, target.emissions, t)),
    happiness: clamp(lerp(w.happiness, target.happiness, t)),
    updatedAt: now,
  }
  return next
}

export default function CarbonOdyssey() {
  const [world, setWorld] = useState<World>(() => loadWorld())
  const [justNudged, setJustNudged] = useState(false)

  useEffect(() => {
    // apply a little natural drift on mount
    const drifted = naturalDrift(loadWorld())
    setWorld(drifted)
    saveWorld(drifted)
  }, [])

  useEffect(() => {
    // persist on change
    saveWorld(world)
  }, [world])

  const todayKey = useMemo(() => {
    const d = new Date()
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
  }, [])

  const canNudgeToday = useMemo(() => {
    if (typeof window === 'undefined') return false
    const last = localStorage.getItem(LS_LAST_NUDGE)
    return last !== todayKey
  }, [todayKey])

  function recordNudge() {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS_LAST_NUDGE, todayKey)
    setJustNudged(true)
  }

  const plantHempForest = () => {
    if (!canNudgeToday) return
    setWorld(prev => {
      const next: World = {
        ...prev,
        biomass: clamp(prev.biomass + 6),
        emissions: clamp(prev.emissions - 4),
        health: clamp(prev.health + 3),
        happiness: clamp(prev.happiness + 2),
        updatedAt: Date.now(),
      }
      return next
    })
    recordNudge()
  }

  const expandIndustry = () => {
    if (!canNudgeToday) return
    setWorld(prev => {
      const next: World = {
        ...prev,
        emissions: clamp(prev.emissions + 6),
        biomass: clamp(prev.biomass - 3),
        health: clamp(prev.health - 4),
        happiness: clamp(prev.happiness - 1),
        updatedAt: Date.now(),
      }
      return next
    })
    recordNudge()
  }

  const composite = useMemo(() => {
    // Happiness biased by high biomass + health and low emissions
    const eco = (world.biomass + world.health) / 2
    const penalty = (100 - world.emissions) // lower emissions => higher score
    return clamp(Math.round((eco * 0.55 + penalty * 0.45)))
  }, [world])

  return (
    <>
      <Head>
        <title>Carbon Odyssey • HEMPIN Lab</title>
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Carbon Odyssey</h1>
            <p className="text-sm opacity-80">
              Nudge the planet once per day. This Level-2 demo simulates a shared world locally (no login required).
            </p>
          </div>
          <Link href="/experiments" className="btn btn-outline">← Back to Lab</Link>
        </div>

        {/* Planet Panel */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/10 via-zinc-900/60 to-black/80 p-6">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 text-sm text-zinc-300">
                Last update: <span className="opacity-80">{humanDate(world.updatedAt)}</span>
              </div>

              {/* Planet visualization */}
              <div className="mx-auto grid h-56 max-w-sm place-items-center">
                <div
                  className="aspect-square w-56 rounded-full shadow-inner ring-1 ring-white/10"
                  style={{
                    background: `radial-gradient(60% 60% at 50% 40%, rgba(34,197,94,${0.15 +
                      world.biomass / 600}) 0%, rgba(20,83,45,0.35) 60%, rgba(0,0,0,0.85) 100%)`,
                    boxShadow: `inset 0 0 80px rgba(0,0,0,.6), 0 30px 60px -20px rgba(0,0,0,.5)`,
                  }}
                />
              </div>

              {/* Meters */}
              <div className="mt-6 grid gap-4">
                <Meter label="Health" value={world.health} good />
                <Meter label="Biomass" value={world.biomass} good />
                <Meter label="Emissions" value={world.emissions} good={false} />
                <Meter label="Happiness" value={world.happiness} good />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6">
            <h2 className="mb-1 text-lg font-semibold">Today’s nudge</h2>
            <p className="mb-4 text-sm opacity-80">
              You can influence the world once per day from this device.
            </p>

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={plantHempForest}
                disabled={!canNudgeToday}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-left text-emerald-300 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🌲 Plant Hemp Forest
                <div className="mt-1 text-xs opacity-80">+biomass, +health, −emissions</div>
              </button>

              <button
                onClick={expandIndustry}
                disabled={!canNudgeToday}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-zinc-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🏭 Expand Industry
                <div className="mt-1 text-xs opacity-80">+emissions, −biomass, −health</div>
              </button>
            </div>

            {!canNudgeToday && (
              <div className="mb-6 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                You already nudged today. Come back tomorrow! {justNudged && '✅ Thanks for your influence.'}
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
              <div className="mb-1 text-sm font-semibold text-white/90">Composite score</div>
              <BigScore value={composite} />
              <p className="mt-2 text-xs opacity-75">
                This blends low emissions with high biomass and health. Aim to keep it above 70 for a thriving planet.
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 text-xs opacity-70">
          This is a **Level-2** demo. For a true collective world, we’ll wire a shared Supabase table and moderation.
        </div>
      </div>
    </>
  )
}

function Meter({ label, value, good = true }: { label: string; value: number; good?: boolean }) {
  const pct = Math.round(value)
  const bar = good
    ? `linear-gradient(90deg, rgba(34,197,94,.7) 0% ${pct}%, rgba(255,255,255,.06) ${pct}% 100%)`
    : `linear-gradient(90deg, rgba(244,63,94,.7) 0% ${pct}%, rgba(255,255,255,.06) ${pct}% 100%)`
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="tabular-nums text-zinc-300">{pct}</span>
      </div>
      <div className="h-2 rounded-full ring-1 ring-white/10" style={{ background: bar }} />
    </div>
  )
}

function BigScore({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-black/50 ring-1 ring-white/10">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
      </div>
      <div className="text-sm opacity-80">
        {value >= 80 ? 'Excellent' : value >= 65 ? 'Stable' : value >= 50 ? 'Vulnerable' : 'In trouble'}
      </div>
    </div>
  )
}