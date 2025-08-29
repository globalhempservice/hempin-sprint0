// pages/experiments/brand-preview.tsx
import { useEffect, useMemo, useRef, useState } from 'react'

type FormState = {
  name: string
  tagline: string
  website: string
  color: string
  logoDataUrl?: string | null
}

const KEY = 'hempin.experiments.brand-preview:v1'

export default function BrandPreview() {
  const [form, setForm] = useState<FormState>({
    name: 'Your Brand',
    tagline: 'Sustainable hemp goods',
    website: 'hempin.co/yourbrand',
    color: '#34d399', // emerald-400
    logoDataUrl: null,
  })

  // persist form
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) setForm(JSON.parse(saved))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(form))
    } catch {}
  }, [form])

  const handleFile = (file?: File | null) => {
    if (!file) return setForm(f => ({ ...f, logoDataUrl: null }))
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, logoDataUrl: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  // svg markup
  const svgRef = useRef<SVGSVGElement | null>(null)
  const svgMarkup = useMemo(() => {
    const w = 1200
    const h = 630
    const pad = 56
    const fg = '#E5E7EB' // zinc-200
    const sub = '#A1A1AA' // zinc-400

    // gradient ids to avoid collisions
    const gid = `g-${Math.random().toString(36).slice(2)}`
    const maskId = `m-${Math.random().toString(36).slice(2)}`

    // build SVG string
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${form.color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#111827" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="${gid}-halo" cx="0.15" cy="0.1" r="1">
      <stop offset="0%" stop-color="${form.color}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <mask id="${maskId}">
      <rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="white"/>
    </mask>
  </defs>

  <g mask="url(#${maskId})">
    <rect width="${w}" height="${h}" fill="url(#${gid})"/>
    <rect width="${w}" height="${h}" fill="url(#${gid}-halo)"/>
    <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" rx="24" fill="rgba(255,255,255,0.02)"/>
  </g>

  ${form.logoDataUrl ? `
    <image href="${form.logoDataUrl}" x="${pad}" y="${pad}" width="120" height="120" preserveAspectRatio="xMidYMid slice" clip-path="circle(56px at 60px 60px)"/>
  ` : `
    <circle cx="${pad + 60}" cy="${pad + 60}" r="56" fill="${form.color}" />
    <text x="${pad + 60}" y="${pad + 66}" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-size="42" font-weight="700" fill="#0B1321">H</text>
  `}

  <text x="${pad + 140}" y="${pad + 56}" font-family="ui-sans-serif,system-ui" font-size="38" font-weight="700" fill="${fg}">
    ${escapeXML(form.name)}
  </text>

  <text x="${pad + 140}" y="${pad + 96}" font-family="ui-sans-serif,system-ui" font-size="22" fill="${sub}">
    ${escapeXML(form.tagline)}
  </text>

  <rect x="${pad + 140}" y="${pad + 116}" rx="8" ry="8" height="34" width="auto" fill="transparent"/>
  <text x="${pad + 140}" y="${pad + 142}" font-family="ui-sans-serif,system-ui" font-size="18" fill="${form.color}">
    ${escapeXML(form.website)}
  </text>

  <text x="${w - pad}" y="${h - pad}" text-anchor="end" font-family="ui-sans-serif,system-ui" font-size="14" fill="${sub}">
    © ${new Date().getFullYear()} HEMPIN
  </text>
</svg>
`.trim()
  }, [form])

  // export PNG
  const exportPng = async () => {
    const svg = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svg)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `hempin-brand-${slugify(form.name)}.png`
      a.click()
    }
    img.src = url
  }

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgMarkup)
      alert('SVG copied to clipboard')
    } catch {
      alert('Could not copy SVG')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brand Preview</h1>
        <div className="flex gap-2">
          <button onClick={exportPng} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-emerald-300 hover:bg-emerald-400/10">Download PNG</button>
          <button onClick={copySvg} className="rounded-lg border border-white/10 px-3 py-2 text-zinc-200 hover:bg-white/5">Copy SVG</button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controls */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="space-y-4">
            <Field label="Brand name">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-emerald-400/40"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="Tagline">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-emerald-400/40"
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
              />
            </Field>

            <Field label="Website">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-emerald-400/40"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
              />
            </Field>

            <Field label="Accent color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <input
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-emerald-400/40"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                />
              </div>
            </Field>

            <Field label="Logo (optional)">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                {form.logoDataUrl && (
                  <button
                    onClick={() => setForm(f => ({ ...f, logoDataUrl: null }))}
                    className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/5"
                  >
                    Remove logo
                  </button>
                )}
              </div>
            </Field>
          </div>
        </section>

        {/* Preview */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 overflow-auto">
          <div className="text-sm text-zinc-400 mb-3">Preview (1200 × 630)</div>
          <div className="rounded-2xl bg-black/30 p-2 shadow-inner">
            <div
              className="w-full overflow-auto"
              style={{ maxWidth: 1200 }}
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-zinc-400">{label}</div>
      {children}
    </label>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

function escapeXML(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}