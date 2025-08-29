// pages/experiments/earth-tamagotchi.tsx
import { useState } from 'react'

type Stat = 'mood' | 'diet' | 'skin'

const INIT = { mood: 50, diet: 50, skin: 50 }

const ACTIONS: {
  id: string
  label: string
  effect: Partial<typeof INIT>
}[] = [
  { id: 'veggies', label: 'Eat more veggies 🌱', effect: { diet: +10, skin: +5, mood: +5 } },
  { id: 'meat', label: 'Eat more meat 🍖', effect: { diet: -10, skin: -5, mood: +3 } },
  { id: 'bike', label: 'Bike instead of drive 🚲', effect: { skin: +10, mood: +5 } },
  { id: 'drive', label: 'Drive car 🚗', effect: { skin: -15, mood: -3 } },
  { id: 'renewable', label: 'Use renewable energy ☀️', effect: { skin: +15, diet: +5 } },
  { id: 'waste', label: 'Waste resources 🗑️', effect: { diet: -15, skin: -10, mood: -5 } },
]

export default function EarthTamagotchi() {
  const [stats, setStats] = useState(INIT)

  const apply = (effect: Partial<typeof INIT>) => {
    setStats((s) => {
      const next: typeof INIT = { ...s }
      ;(Object.keys(effect) as Stat[]).forEach((k) => {
        next[k] = Math.min(100, Math.max(0, s[k] + (effect[k] ?? 0)))
      })
      return next
    })
  }

  const moodEmoji =
    stats.mood > 70 ? '😊' : stats.mood > 40 ? '😐' : '😢'
  const skinEmoji =
    stats.skin > 70 ? '🌳' : stats.skin > 40 ? '🏜️' : '🔥'
  const dietEmoji =
    stats.diet > 70 ? '🥗' : stats.diet > 40 ? '🍽️' : '💀'

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">🌍 Earth Tamagotchi</h1>
      <p className="text-zinc-400">
        Take care of Earth by balancing its <b>Diet</b>, <b>Skin</b>, and <b>Mood</b>.
        Each choice shifts the balance. Can you keep Earth happy?
      </p>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl">{moodEmoji}</div>
          <div className="mt-2 text-sm">Mood {stats.mood}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl">{skinEmoji}</div>
          <div className="mt-2 text-sm">Skin {stats.skin}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-3xl">{dietEmoji}</div>
          <div className="mt-2 text-sm">Diet {stats.diet}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => apply(a.effect)}
            className="rounded-xl border border-emerald-400/30 bg-black/40 px-4 py-3 text-left text-sm hover:bg-emerald-400/10"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Reset */}
      <div className="pt-6">
        <button
          onClick={() => setStats(INIT)}
          className="rounded-lg border border-white/20 px-3 py-2 text-xs text-zinc-400 hover:bg-white/5"
        >
          Reset Earth
        </button>
      </div>
    </main>
  )
}