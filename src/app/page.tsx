'use client'
import dynamic from 'next/dynamic'
const Orb = dynamic(() => import('@/components/Orb'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-dvh relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,#0e0e12_10%,#050507_70%)]" />
      <section className="relative z-10 px-6 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Enter Hempin</h1>
        <p className="opacity-80 max-w-xl mx-auto">One profile to explore the hemp universe.</p>
        <div className="flex justify-center">
          <a href="/account" className="inline-flex items-center rounded-md px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20">
            Login / Sign up
          </a>
        </div>
        <p className="text-xs opacity-60 pt-6 select-none">HEMPIN — 2025</p>
      </section>
      <div className="absolute inset-0 flex items-center justify-center">
        <Orb />
      </div>
    </main>
  )
}