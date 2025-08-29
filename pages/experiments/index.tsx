// pages/experiments/index.tsx
import Link from 'next/link'

const CARDS = [
  {
    href: '/experiments/slot',
    title: 'Carbon Slot Machine',
    desc: 'Spin to “grow” micro carbon offsets with hemp-y icons.',
    badge: 'Play',
  },
  {
    href: '/experiments/field',
    title: 'Grow Your Hemp Field',
    desc: 'Plant • Grow • Harvest → see fiber/seed/hurd output.',
    badge: 'Simulate',
  },
  {
    href: '/experiments/closet',
    title: 'Hemp Closet',
    desc: 'Dress an avatar and see water/CO₂ savings vs cotton.',
    badge: 'Style',
  },
  {
    href: '/experiments/house',
    title: 'Build a Hemp House',
    desc: 'Toggle components (hempcrete, insulation) → impact math.',
    badge: 'Design',
  },
]

export default function ExperimentsLab() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-zinc-900 to-black text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">HEMPIN Lab</h1>
        <p className="mt-2 max-w-2xl text-zinc-300">
          A playful lab of micro-experiments for hemp education, climate impact and good vibes.
          No login required. Click any card to try it.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {CARDS.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:shadow-emerald-500/20 hover:border-emerald-400/30"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{c.title}</h2>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  {c.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{c.desc}</p>
              <div className="mt-4 h-28 rounded-xl bg-gradient-to-br from-emerald-600/20 via-emerald-400/10 to-transparent ring-1 ring-inset ring-white/5" />
              <div className="mt-4 text-sm text-emerald-300 opacity-0 group-hover:opacity-100 transition">
                Open experiment →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}