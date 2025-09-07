'use client'
import { useEffect, useRef } from 'react'

/**
 * GlowOrb — visual Atom (purely decorative).
 * No layout, no content. Parent controls positioning/z-index.
 */
export default function GlowOrb() {
  const ref = useRef<HTMLDivElement>(null)

  // gentle idle breathing
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let t = 0
    let raf = 0
    const loop = () => {
      t += 0.015
      const scale = 1 + Math.sin(t) * 0.02 // 2% pulse
      const rotate = Math.sin(t * 0.6) * 4 // subtle sway
      el.style.transform = `translateZ(0) scale(${scale}) rotate(${rotate}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none select-none"
      style={{
        width: 'min(56vh, 520px)',
        height: 'min(56vh, 520px)',
        borderRadius: '50%',
        filter: 'blur(14px) saturate(120%)',
        background: `
          radial-gradient(35% 35% at 35% 35%, rgba(255,255,255,0.25), transparent 60%),
          radial-gradient(closest-side, rgba(255,255,255,0.12), transparent),
          radial-gradient(circle at 70% 40%, hsl(160 80% 55% / .9), transparent 40%),
          radial-gradient(circle at 30% 65%, hsl(260 85% 65% / .9), transparent 45%),
          radial-gradient(80% 80% at 50% 50%, rgba(255,255,255,0.08), rgba(0,0,0,0.3))
        `,
        boxShadow:
          '0 0 120px 40px hsl(260 90% 65% / .35), inset 0 0 80px rgba(255,255,255,.08)',
        transition: 'transform 600ms cubic-bezier(.2,.9,.2,1)',
      }}
    />
  )
}