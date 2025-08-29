// pages/experiments/slot.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
const LS_KEY = 'exp.slot.offset.v1'
const LS_VOTES = 'exp.slot.votes.v1'

const SYMBOLS = ['🌿','🌞','💧','🪴','🧱'] // hemp, sun, water, plant, block(hempcrete)

function loadNumber(key: string, def = 0) {
  if (typeof window === 'undefined') return def
  const v = window.localStorage.getItem(key)
  const n = v ? Number(v) : def
  return Number.isFinite(n) ? n : def
}
function saveNumber(key: string, value: number) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, String(value))
}

export default function Slot() {
  const [reels, setReels] = useState([0,0,0])
  const [spinning, setSpinning] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [kg, setKg] = useState(() => loadNumber(LS_KEY, 0))
  const [votes, setVotes] = useState(() => loadNumber(LS_VOTES, 0))
  const timer = useRef<any>(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const spin = () => {
    if (spinning) return
    setMsg(null)
    setSpinning(true)
    // fake rolling animation
    let steps = 18 + Math.floor(Math.random()*10)
    let i = 0
    const tick = () => {
      setReels(r => r.map((v, idx) => (i + idx) % SYMBOLS.length))
      i++
      if (i < steps) {
        timer.current = setTimeout(tick, 60)
      } else {
        // final result
        const final = [0,0,0].map(() => Math.floor(Math.random()*SYMBOLS.length))
        setReels(final)
        const reward = score(final)
        if (reward > 0) {
          const total = Number((kg + reward).toFixed(3))
          setKg(total); saveNumber(LS_KEY, total)
          setMsg(`Nice! You “offset” ${reward.toFixed(3)} kg CO₂ (demo).`)
        } else {
          setMsg('No match. Try again 🌿')
        }
        setSpinning(false)
      }
    }
    tick()
  }

  const score = (idxs: number[]) => {
    // simple payout table
    const a = idxs.map(i => SYMBOLS[i])
    const allSame = a.every(x => x === a[0])
    if (allSame) {
      switch (a[0]) {
        case '🌿': return 0.5
        case '🧱': return 0.35
        case '🌞': return 0.3
        case '💧': return 0.2
        default: return 0.15
      }
    }
    // any two match → micro
    const twoMatch =
      a[0] === a[1] || a[1] === a[2] || a[0] === a[2]
    return twoMatch ? 0.05 : 0
  }

  const vote = () => {
    const v = votes + 1
    setVotes(v); saveNumber(LS_VOTES, v)
  }

  const display = useMemo(() => reels.map(i => SYMBOLS[i]), [reels])

  const reset = () => {
    setKg(0); saveNumber(LS_KEY, 0)
    setMsg('Progress reset.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-emerald-950 text-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Carbon Slot Machine</h1>
        <p className="mt-2 text-zinc-300">
          Pure demo. Wins add tiny “offsets” to your local total (not on-chain… yet).
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-3 gap-3">
            {display.map((s, i) => (
              <div key={i} className="grid h-28 place-items-center rounded-xl bg-black/50 ring-1 ring-white/10 text-5xl">
                {s}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={spin}
              disabled={spinning}
              className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-black disabled:opacity-60"
            >
              {spinning ? 'Spinning…' : 'Spin'}
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              Reset demo
            </button>
            <button
              onClick={vote}
              className="ml-auto rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300"
            >
              👍 Vote ({votes})
            </button>
          </div>

          <div className="mt-4 text-sm text-emerald-300">
            Total (local): <span className="font-semibold">{kg.toFixed(3)} kg CO₂</span>
          </div>
          {msg && <div className="mt-2 text-sm text-zinc-200">{msg}</div>}
        </div>
      </div>
    </div>
  )
}