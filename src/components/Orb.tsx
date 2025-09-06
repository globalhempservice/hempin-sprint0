'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  active?: boolean
}

export default function Orb({ active = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const boostRef = useRef(0)
  const [boost, setBoost] = useState(0)
  const [ring, setRing] = useState<number | null>(null)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reduce.current) return
    const el = ref.current
    if (!el) return
    let t = 0
    let raf: number
    const loop = () => {
      t += 0.008
      const s = 0.97 + Math.sin(t) * 0.03 + boostRef.current * 0.06
      const x = Math.sin(t * 0.6) * 3
      const y = Math.cos(t * 0.4) * 2
      el.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const from = boostRef.current
    const to = active ? 1 : 0
    const duration = 150
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const val = from + (to - from) * eased
      boostRef.current = val
      setBoost(val)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active])

  useEffect(() => {
    if (active && !reduce.current) {
      setRing(Date.now())
      const t = setTimeout(() => setRing(null), 700)
      return () => clearTimeout(t)
    }
  }, [active])

  return (
    <div
      ref={ref}
      aria-hidden
      className="orb"
      style={{ '--boost': boost } as React.CSSProperties}
    >
      {ring && <span key={ring} className="orb-ring" />}
    </div>
  )
}
