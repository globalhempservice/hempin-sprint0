'use client'
import { useEffect, useRef } from 'react'

export default function Orb() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let t = 0, raf = 0
    const loop = () => {
      t += 0.008
      const s = 0.92 + Math.sin(t) * 0.05
      const x = Math.sin(t * 0.6) * 10
      const y = Math.cos(t * 0.4) * 8
      el.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <div ref={ref} aria-hidden className="orb" />
}