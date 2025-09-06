'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import Orb from '../components/Orb'

export default function Home() {
  const [active, setActive] = useState(false)
  const touchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => setActive(true)
  const handleMouseLeave = () => setActive(false)

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.matches(':focus-visible')) setActive(true)
  }
  const handleBlur = () => setActive(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'touch') {
      setActive(true)
      if (touchTimeout.current) clearTimeout(touchTimeout.current)
      touchTimeout.current = setTimeout(() => setActive(false), 1200)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--bg),_#050507_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-noise" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Orb active={active} />
      </div>
      <section className="relative z-10 text-center space-y-6 px-6">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Welcome, <span className="text-brand-2">Hempin</span> traveler.
        </h1>
        <p className="opacity-80 max-w-xl mx-auto">
          This is your portal. One profile to explore the hemp universe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/account"
            className="btn btn-primary"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPointerDown={handlePointerDown}
          >
            Login / Sign up
          </Link>
          <Link href="/learn-more" className="btn btn-outline">
            What is Hempin?
          </Link>
        </div>
        <p className="text-xs opacity-60 pt-6">HEMPIN — 2025</p>
      </section>
    </main>
  )
}
