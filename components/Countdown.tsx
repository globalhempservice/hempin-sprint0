// components/Countdown.tsx
import { useEffect, useMemo, useState } from 'react'

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diffParts(to: number): Parts {
  const total = Math.max(0, to - Date.now())
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((total / (1000 * 60)) % 60)
  const seconds = Math.floor((total / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function Countdown({
  target,
  label = 'Launch in',
}: {
  target: string | number | Date
  label?: string
}) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target])
  const [t, setT] = useState<Parts>(() => diffParts(targetMs))

  useEffect(() => {
    const id = setInterval(() => setT(diffParts(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 px-5 py-3">
      <span className="text-zinc-400 text-sm">{label}</span>
      <TimeBlock v={t.days} u="days" />
      <Sep />
      <TimeBlock v={t.hours} u="hrs" />
      <Sep />
      <TimeBlock v={t.minutes} u="min" />
      <Sep />
      <TimeBlock v={t.seconds} u="sec" />
    </div>
  )
}

function Sep() {
  return <span className="text-zinc-600">:</span>
}

function TimeBlock({ v, u }: { v: number; u: string }) {
  return (
    <div className="text-center">
      <div className="tabular-nums text-2xl font-semibold">{String(v).padStart(2, '0')}</div>
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{u}</div>
    </div>
  )
}