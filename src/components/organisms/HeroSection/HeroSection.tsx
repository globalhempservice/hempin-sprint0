'use client'
import Link from 'next/link'
import { GlowOrb } from '@/components/atoms/visual/GlowOrb'

/**
 * HeroSection — Organism that positions GlowOrb behind copy + CTA.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] bg-[#0a0a0d] text-white overflow-hidden">
      {/* moving noise background (optional, see CSS snippet below) */}
      <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden />

      {/* Orb behind content */}
      <div className="absolute inset-0 grid place-items-center -z-10">
        <GlowOrb />
      </div>

      {/* Centered copy */}
      <div className="relative z-10 px-6 text-center space-y-6 flex min-h-[100svh] flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Enter Hempin</h1>
        <p className="opacity-80 max-w-xl mx-auto">
          One profile to explore the hemp universe.
        </p>
        <Link
          href="#"
          className="inline-flex items-center rounded-md px-5 py-3 bg-white/10 border border-white/15 hover:bg-white/15 transition"
        >
          Login / Sign up
        </Link>
        <p className="text-xs opacity-60 pt-6 select-none">HEMPIN — 2025</p>
      </div>
    </section>
  )
}