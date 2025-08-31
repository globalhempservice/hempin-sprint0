// pages/colorpalette.tsx
import Head from 'next/head'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

type Swatch = { name: string; className: string; hex?: string }

const sections: { title: string; note?: string; swatches: Swatch[] }[] = [
  {
    title: 'Core (Site)',
    note: 'Primary “hemp green” + black/ink neutrals',
    swatches: [
      { name: 'Emerald 500', className: 'bg-emerald-500', hex: '#10B981' },
      { name: 'Emerald 400', className: 'bg-emerald-400', hex: '#34D399' },
      { name: 'Ink',          className: 'bg-black',        hex: '#000000' },
      { name: 'Zinc 900',     className: 'bg-zinc-900',     hex: '#18181B' },
      { name: 'Zinc 700',     className: 'bg-zinc-700',     hex: '#3F3F46' },
    ],
  },
  {
    title: 'Trade (Blue/Cyan)',
    swatches: [
      { name: 'Blue 600', className: 'bg-blue-600', hex: '#2563EB' },
      { name: 'Cyan 500', className: 'bg-cyan-500', hex: '#06B6D4' },
    ],
  },
  {
    title: 'Supermarket (Violet/Fuchsia)',
    swatches: [
      { name: 'Violet 600',  className: 'bg-violet-600',  hex: '#7C3AED' },
      { name: 'Fuchsia 500', className: 'bg-fuchsia-500', hex: '#E879F9' },
    ],
  },
  {
    title: 'Events (Orange/Amber)',
    swatches: [
      { name: 'Orange 600', className: 'bg-orange-600', hex: '#EA580C' },
      { name: 'Amber 500',  className: 'bg-amber-500',  hex: '#F59E0B' },
    ],
  },
  {
    title: 'Research (Teal/Emerald)',
    swatches: [
      { name: 'Teal 500',    className: 'bg-teal-500',    hex: '#14B8A6' },
      { name: 'Emerald 500', className: 'bg-emerald-500', hex: '#10B981' },
    ],
  },
  {
    title: 'Experiments (Rainbow)',
    note: 'Use gradients across universes',
    swatches: [
      { name: 'Emerald→Sky',    className: 'bg-gradient-to-r from-emerald-500 to-sky-500' },
      { name: 'Violet→Fuchsia', className: 'bg-gradient-to-r from-violet-600 to-fuchsia-500' },
      { name: 'Orange→Rose',    className: 'bg-gradient-to-r from-orange-600 to-rose-500' },
    ],
  },
]

export default function ColorPalette() {
  return (
    <>
      <Head>
        <title>HEMPIN • Color Palette</title>
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SiteNav />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Brand Palette</h1>
          <p className="mt-2 text-zinc-300">
            Reference sheet for universes (Trade, Supermarket, Events, Research) + Experiments rainbow.
          </p>

          <div className="mt-8 space-y-10">
            {sections.map((sec) => (
              <section key={sec.title}>
                <h2 className="text-xl font-semibold">{sec.title}</h2>
                {sec.note && <p className="text-sm text-zinc-400 mt-1">{sec.note}</p>}
                <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sec.swatches.map((s) => (
                    <div key={s.name} className="rounded-xl overflow-hidden ring-1 ring-white/10">
                      <div className={`h-24 ${s.className}`} />
                      <div className="p-3 text-sm">
                        <div className="font-medium">{s.name}</div>
                        {s.hex && <div className="text-zinc-400">{s.hex}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}