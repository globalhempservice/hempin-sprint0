// pages/experiments/lca-lab.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

type Role = 'Farmer' | 'Processor' | 'Brand' | 'Retailer' | 'Logistics'
type TransportMode = 'truck' | 'ship' | 'rail' | 'air'
type PackMat = 'paper' | 'plastic' | 'glass' | 'aluminum' | 'hemp-bio'

type Inputs = {
  unitName: string // e.g. "kg fiber" or "product unit"
  productMassKg: number
  role: Role

  cultivation: {
    areaHa: number
    yieldKgPerHa: number
    irrigationM3: number
    fertilizerKgN: number
    electricityKwh: number
  }

  processing: {
    electricityKwh: number
    heatKwh: number
    solventKg: number
  }

  logistics: {
    distanceKm: number
    massKg: number
    mode: TransportMode
  }

  packaging: {
    material: PackMat
    massKg: number
  }

  endOfLife: {
    recyclePct: number
    landfillPct: number
    compostPct: number
  }
}

type Factors = {
  electricity_kg_per_kwh: number
  heat_kg_per_kwh: number
  n_fertilizer_kg_per_kg: number
  irrigation_kg_per_m3: number
  solvent_kg_per_kg: number
  transport_kg_per_kgkm: Record<TransportMode, number>
  packaging_kg_per_kg: Record<PackMat, number>
  eol_landfill_kg_per_kg: number
  eol_recycle_credit_kg_per_kg: number
  eol_compost_credit_kg_per_kg: number
}

const DEFAULT_INPUTS: Inputs = {
  unitName: 'unit',
  productMassKg: 1,
  role: 'Brand',
  cultivation: { areaHa: 1, yieldKgPerHa: 1000, irrigationM3: 5, fertilizerKgN: 0.2, electricityKwh: 2 },
  processing: { electricityKwh: 4, heatKwh: 3, solventKg: 0.1 },
  logistics: { distanceKm: 800, massKg: 1, mode: 'ship' },
  packaging: { material: 'hemp-bio', massKg: 0.08 },
  endOfLife: { recyclePct: 40, landfillPct: 40, compostPct: 20 },
}

const DEFAULT_FACTORS: Factors = {
  electricity_kg_per_kwh: 0.4,       // grid-average placeholder
  heat_kg_per_kwh: 0.2,              // low-carbon thermal placeholder
  n_fertilizer_kg_per_kg: 3.0,       // cradle-to-gate placeholder
  irrigation_kg_per_m3: 0.0005,      // pumping & treatment placeholder
  solvent_kg_per_kg: 1.5,            // generic
  transport_kg_per_kgkm: {
    truck: 0.00012,  // per kg-km
    rail:  0.00002,
    ship:  0.000015,
    air:   0.0012,
  },
  packaging_kg_per_kg: {
    paper: 1.0,
    plastic: 2.5,
    glass: 1.2,
    aluminum: 10.0,
    'hemp-bio': 0.8,
  },
  eol_landfill_kg_per_kg: 0.5,
  eol_recycle_credit_kg_per_kg: -0.3,
  eol_compost_credit_kg_per_kg: -0.2,
}

type Breakdown = {
  cultivation: number
  processing: number
  logistics: number
  packaging: number
  endOfLife: number
  total: number
  perUnit: number
}

function clamp(n: number, a: number, b: number) { return Math.min(b, Math.max(a, n)) }

function calc(inputs: Inputs, f: Factors): Breakdown {
  const cultivatedKg = inputs.cultivation.areaHa * inputs.cultivation.yieldKgPerHa
  // Allocate cultivation to the product mass (simple proportional allocation)
  const allocation = inputs.productMassKg / Math.max(cultivatedKg, 1)

  const cultivation =
    (inputs.cultivation.electricityKwh * f.electricity_kg_per_kwh) +
    (inputs.cultivation.fertilizerKgN * f.n_fertilizer_kg_per_kg) +
    (inputs.cultivation.irrigationM3 * f.irrigation_kg_per_m3)

  const processing =
    (inputs.processing.electricityKwh * f.electricity_kg_per_kwh) +
    (inputs.processing.heatKwh * f.heat_kg_per_kwh) +
    (inputs.processing.solventKg * f.solvent_kg_per_kg)

  const logistics =
    inputs.logistics.massKg * inputs.logistics.distanceKm * f.transport_kg_per_kgkm[inputs.logistics.mode]

  const packaging =
    inputs.packaging.massKg * f.packaging_kg_per_kg[inputs.packaging.material]

  const totalMassForEOL = inputs.productMassKg + inputs.packaging.massKg
  const eol =
    (totalMassForEOL * (inputs.endOfLife.landfillPct / 100)) * f.eol_landfill_kg_per_kg +
    (totalMassForEOL * (inputs.endOfLife.recyclePct / 100)) * f.eol_recycle_credit_kg_per_kg +
    (totalMassForEOL * (inputs.endOfLife.compostPct / 100)) * f.eol_compost_credit_kg_per_kg

  // Allocate cultivation
  const cultivationForUnit = cultivation * allocation

  const total = cultivationForUnit + processing + logistics + packaging + eol
  const perUnit = total / Math.max(inputs.productMassKg, 1)

  return { cultivation: cultivationForUnit, processing, logistics, packaging, endOfLife: eol, total, perUnit }
}

function scoreFromTotal(total: number) {
  // Soft-bounded score: good if total is small relative to a baseline (10 kg/unit)
  const baseline = 10
  const s = 100 * (1 - (total / (baseline + total)))
  return Math.round(clamp(s, 1, 100))
}

function fmtKg(n: number) { return `${n.toFixed(2)} kg CO₂e` }

function loadHash<T>() {
  if (typeof window === 'undefined') return null
  try {
    if (window.location.hash.startsWith('#lca=')) {
      const b64 = window.location.hash.slice(5)
      const json = atob(b64)
      return JSON.parse(json) as T
    }
  } catch {}
  return null
}

export default function LcaLab() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS)
  const [factors, setFactors] = useState<Factors>(DEFAULT_FACTORS)
  const [step, setStep] = useState(0)
  const [proMode, setProMode] = useState(false)

  // hydrate from localStorage/hash
  useEffect(() => {
    const fromHash = loadHash<{ inputs: Inputs; factors: Factors }>()
    const stored = typeof window !== 'undefined' ? localStorage.getItem('hempin.lca.v1') : null
    if (fromHash) {
      setInputs(fromHash.inputs)
      setFactors(fromHash.factors)
    } else if (stored) {
      try {
        const { inputs: i, factors: f } = JSON.parse(stored)
        setInputs(i); setFactors(f)
      } catch {}
    }
  }, [])

  // persist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hempin.lca.v1', JSON.stringify({ inputs, factors }))
    }
  }, [inputs, factors])

  const b = useMemo(() => calc(inputs, factors), [inputs, factors])
  const score = scoreFromTotal(b.total)

  const quests = [
    { id: 'q1', label: 'Switch to low-carbon packaging', ok: inputs.packaging.material === 'hemp-bio' || inputs.packaging.material === 'paper' },
    { id: 'q2', label: 'Reduce air transport', ok: inputs.logistics.mode !== 'air' },
    { id: 'q3', label: 'Boost recycling to 60%+', ok: inputs.endOfLife.recyclePct >= 60 },
    { id: 'q4', label: 'Lower total below 5 kg CO₂e', ok: b.total < 5 },
  ]
  const allQuestsDone = quests.every(q => q.ok)

  const share = () => {
    if (typeof window === 'undefined') return
    const payload = btoa(JSON.stringify({ inputs, factors }))
    const url = `${window.location.origin}/experiments/lca-lab#lca=${payload}`
    navigator.clipboard?.writeText(url)
    alert('Permalink copied to clipboard!')
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ inputs, factors, breakdown: b }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hempin-lca-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result))
        if (obj.inputs) setInputs(obj.inputs)
        if (obj.factors) setFactors(obj.factors)
        alert('Imported!')
      } catch {
        alert('Invalid file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Head>
        <title>HEMPIN • LCA Lab</title>
        <meta name="description" content="Gamified lifecycle assessment for hemp & cannabis supply chains." />
      </Head>

      <main className="relative min-h-screen bg-[radial-gradient(70%_60%_at_50%_-10%,#22C55E33_0%,rgba(34,197,94,0)_55%),radial-gradient(60%_50%_at_120%_10%,#0EA5E933_0%,rgba(14,165,233,0)_55%),#0b0b0b] text-white">
        {/* glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />

        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">HL</span>
              <div>
                <div className="text-sm font-semibold">LCA Lab</div>
                <div className="text-xs text-white/60">for hemp & cannabis supply chains</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button onClick={() => setProMode(v => !v)} className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">
                {proMode ? 'Pro mode: ON' : 'Pro mode: OFF'}
              </button>
              <button onClick={share} className="rounded-lg bg-white px-3 py-1.5 font-medium text-black hover:bg-emerald-200">Permalink</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h1 className="text-3xl font-extrabold sm:text-4xl">Lifecycle Assessment — Play to Optimize</h1>
              <p className="mt-2 text-white/80">
                Model a product’s footprint, tweak key levers, and unlock badges as you reduce impact.
                This is an educational, fast-estimate tool — not a full ISO-compliant LCA — but it helps teams reason about orders of magnitude.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Kpi label="Score" value={`${score}/100`} />
                <Kpi label="Total per unit" value={fmtKg(b.perUnit)} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold">Impact breakdown</h3>
              <div className="mt-3">
                <Bar label="Cultivation" value={b.cultivation} total={b.total} />
                <Bar label="Processing" value={b.processing} total={b.total} />
                <Bar label="Logistics" value={b.logistics} total={b.total} />
                <Bar label="Packaging" value={b.packaging} total={b.total} />
                <Bar label="End-of-life" value={b.endOfLife} total={b.total} />
              </div>
              <div className="mt-4 text-sm text-white/70">Total: <span className="font-semibold text-white">{fmtKg(b.total)}</span></div>
            </div>
          </div>
        </section>

        {/* Wizard */}
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <Stepper step={step} setStep={setStep} />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-6">
              {step === 0 && <Card title="1) Define scope">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Your role" value={inputs.role} onChange={v => setInputs(s => ({ ...s, role: v as Role }))} options={['Farmer','Processor','Brand','Retailer','Logistics']} />
                  <InputNumber label="Product mass per unit (kg)" value={inputs.productMassKg} onChange={v => setInputs(s => ({ ...s, productMassKg: v }))} min={0.01} step={0.01} />
                  <Input label="Functional unit name" value={inputs.unitName} onChange={v => setInputs(s => ({ ...s, unitName: v }))} />
                </div>
                <p className="mt-3 text-sm text-white/70">Tip: set mass≈1 for “per unit” results, or the expected unit weight.</p>
              </Card>}

              {step === 1 && <Card title="2) Cultivation">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputNumber label="Area cultivated (ha)" value={inputs.cultivation.areaHa} onChange={v => setInputs(s => ({ ...s, cultivation: { ...s.cultivation, areaHa: v } }))} min={0.01} step={0.01} />
                  <InputNumber label="Yield (kg/ha)" value={inputs.cultivation.yieldKgPerHa} onChange={v => setInputs(s => ({ ...s, cultivation: { ...s.cultivation, yieldKgPerHa: v } }))} min={1} step={1} />
                  <InputNumber label="Irrigation (m³)" value={inputs.cultivation.irrigationM3} onChange={v => setInputs(s => ({ ...s, cultivation: { ...s.cultivation, irrigationM3: v } }))} min={0} step={0.1} />
                  <InputNumber label="Fertilizer N (kg)" value={inputs.cultivation.fertilizerKgN} onChange={v => setInputs(s => ({ ...s, cultivation: { ...s.cultivation, fertilizerKgN: v } }))} min={0} step={0.01} />
                  <InputNumber label="Electricity (kWh)" value={inputs.cultivation.electricityKwh} onChange={v => setInputs(s => ({ ...s, cultivation: { ...s.cultivation, electricityKwh: v } }))} min={0} step={0.1} />
                </div>
              </Card>}

              {step === 2 && <Card title="3) Processing">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputNumber label="Electricity (kWh)" value={inputs.processing.electricityKwh} onChange={v => setInputs(s => ({ ...s, processing: { ...s.processing, electricityKwh: v } }))} min={0} step={0.1} />
                  <InputNumber label="Heat (kWh)" value={inputs.processing.heatKwh} onChange={v => setInputs(s => ({ ...s, processing: { ...s.processing, heatKwh: v } }))} min={0} step={0.1} />
                  <InputNumber label="Solvent use (kg)" value={inputs.processing.solventKg} onChange={v => setInputs(s => ({ ...s, processing: { ...s.processing, solventKg: v } }))} min={0} step={0.01} />
                </div>
              </Card>}

              {step === 3 && <Card title="4) Logistics & Packaging">
                <div className="grid gap-4 sm:grid-cols-3">
                  <InputNumber label="Distance (km)" value={inputs.logistics.distanceKm} onChange={v => setInputs(s => ({ ...s, logistics: { ...s.logistics, distanceKm: v } }))} min={0} step={1} />
                  <InputNumber label="Shipped mass (kg)" value={inputs.logistics.massKg} onChange={v => setInputs(s => ({ ...s, logistics: { ...s.logistics, massKg: v } }))} min={0} step={0.01} />
                  <Select label="Mode" value={inputs.logistics.mode} onChange={v => setInputs(s => ({ ...s, logistics: { ...s.logistics, mode: v as TransportMode } }))} options={['truck','rail','ship','air']} />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Select label="Packaging" value={inputs.packaging.material} onChange={v => setInputs(s => ({ ...s, packaging: { ...s.packaging, material: v as PackMat } }))} options={['hemp-bio','paper','plastic','glass','aluminum']} />
                  <InputNumber label="Packaging mass (kg)" value={inputs.packaging.massKg} onChange={v => setInputs(s => ({ ...s, packaging: { ...s.packaging, massKg: v } }))} min={0} step={0.01} />
                </div>
              </Card>}

              {step === 4 && <Card title="5) End-of-life split">
                <div className="grid gap-4 sm:grid-cols-3">
                  <InputNumber label="Recycle (%)" value={inputs.endOfLife.recyclePct} onChange={v => setInputs(s => ({ ...s, endOfLife: { ...s.endOfLife, recyclePct: v } }))} min={0} max={100} step={1} />
                  <InputNumber label="Compost (%)" value={inputs.endOfLife.compostPct} onChange={v => setInputs(s => ({ ...s, endOfLife: { ...s.endOfLife, compostPct: v } }))} min={0} max={100} step={1} />
                  <InputNumber label="Landfill (%)" value={inputs.endOfLife.landfillPct} onChange={v => setInputs(s => ({ ...s, endOfLife: { ...s.endOfLife, landfillPct: v } }))} min={0} max={100} step={1} />
                </div>
                <p className="mt-3 text-sm text-white/70">These should add up to ~100%. LCA Lab won’t force it; it just uses the given shares.</p>
              </Card>}

              {proMode && <Card title="Pro mode — Emission factors">
                <div className="grid gap-4 sm:grid-cols-3">
                  <InputNumber label="Electricity (kg/kWh)" value={factors.electricity_kg_per_kwh} onChange={v => setFactors(s => ({ ...s, electricity_kg_per_kwh: v }))} min={0} step={0.01} />
                  <InputNumber label="Heat (kg/kWh)" value={factors.heat_kg_per_kwh} onChange={v => setFactors(s => ({ ...s, heat_kg_per_kwh: v }))} min={0} step={0.01} />
                  <InputNumber label="N fertilizer (kg/kg)" value={factors.n_fertilizer_kg_per_kg} onChange={v => setFactors(s => ({ ...s, n_fertilizer_kg_per_kg: v }))} min={0} step={0.1} />
                  <InputNumber label="Irrigation (kg/m³)" value={factors.irrigation_kg_per_m3} onChange={v => setFactors(s => ({ ...s, irrigation_kg_per_m3: v }))} min={0} step={0.0001} />
                  <InputNumber label="Solvent (kg/kg)" value={factors.solvent_kg_per_kg} onChange={v => setFactors(s => ({ ...s, solvent_kg_per_kg: v }))} min={0} step={0.01} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                  <InputNumber label="Truck (kg/kg·km)" value={factors.transport_kg_per_kgkm.truck} onChange={v => setFactors(s => ({ ...s, transport_kg_per_kgkm: { ...s.transport_kg_per_kgkm, truck: v } }))} min={0} step={0.00001} />
                  <InputNumber label="Rail (kg/kg·km)" value={factors.transport_kg_per_kgkm.rail} onChange={v => setFactors(s => ({ ...s, transport_kg_per_kgkm: { ...s.transport_kg_per_kgkm, rail: v } }))} min={0} step={0.00001} />
                  <InputNumber label="Ship (kg/kg·km)" value={factors.transport_kg_per_kgkm.ship} onChange={v => setFactors(s => ({ ...s, transport_kg_per_kgkm: { ...s.transport_kg_per_kgkm, ship: v } }))} min={0} step={0.00001} />
                  <InputNumber label="Air (kg/kg·km)" value={factors.transport_kg_per_kgkm.air} onChange={v => setFactors(s => ({ ...s, transport_kg_per_kgkm: { ...s.transport_kg_per_kgkm, air: v } }))} min={0} step={0.0001} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-5">
                  <InputNumber label="Paper (kg/kg)" value={factors.packaging_kg_per_kg.paper} onChange={v => setFactors(s => ({ ...s, packaging_kg_per_kg: { ...s.packaging_kg_per_kg, paper: v } }))} min={0} step={0.01} />
                  <InputNumber label="Plastic (kg/kg)" value={factors.packaging_kg_per_kg.plastic} onChange={v => setFactors(s => ({ ...s, packaging_kg_per_kg: { ...s.packaging_kg_per_kg, plastic: v } }))} min={0} step={0.01} />
                  <InputNumber label="Glass (kg/kg)" value={factors.packaging_kg_per_kg.glass} onChange={v => setFactors(s => ({ ...s, packaging_kg_per_kg: { ...s.packaging_kg_per_kg, glass: v } }))} min={0} step={0.01} />
                  <InputNumber label="Aluminum (kg/kg)" value={factors.packaging_kg_per_kg.aluminum} onChange={v => setFactors(s => ({ ...s, packaging_kg_per_kg: { ...s.packaging_kg_per_kg, aluminum: v } }))} min={0} step={0.1} />
                  <InputNumber label="Hemp-bio (kg/kg)" value={factors.packaging_kg_per_kg['hemp-bio']} onChange={v => setFactors(s => ({ ...s, packaging_kg_per_kg: { ...s.packaging_kg_per_kg, 'hemp-bio': v } }))} min={0} step={0.01} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <InputNumber label="Landfill (kg/kg)" value={factors.eol_landfill_kg_per_kg} onChange={v => setFactors(s => ({ ...s, eol_landfill_kg_per_kg: v }))} min={-2} step={0.01} />
                  <InputNumber label="Recycle credit (kg/kg)" value={factors.eol_recycle_credit_kg_per_kg} onChange={v => setFactors(s => ({ ...s, eol_recycle_credit_kg_per_kg: v }))} min={-2} step={0.01} />
                  <InputNumber label="Compost credit (kg/kg)" value={factors.eol_compost_credit_kg_per_kg} onChange={v => setFactors(s => ({ ...s, eol_compost_credit_kg_per_kg: v }))} min={-2} step={0.01} />
                </div>
              </Card>}
            </div>

            {/* Sidebar: Quests + Actions */}
            <div className="space-y-6">
              <Card title="Quests">
                <ul className="space-y-2">
                  {quests.map(q => (
                    <li key={q.id} className="flex items-center gap-2 text-sm">
                      <span className={`grid h-5 w-5 place-items-center rounded ${q.ok ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/70'}`}>{q.ok ? '✓' : '•'}</span>
                      <span className={q.ok ? 'text-white' : 'text-white/80'}>{q.label}</span>
                    </li>
                  ))}
                </ul>
                {allQuestsDone && (
                  <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-center text-emerald-200">
                    🌿 Badge unlocked: <b>Impact Optimizer</b>
                  </div>
                )}
              </Card>

              <Card title="Data">
                <div className="flex flex-wrap gap-2">
                  <button onClick={exportJson} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Export JSON</button>
                  <label className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 cursor-pointer">
                    Import JSON
                    <input type="file" accept="application/json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) importJson(f) }} />
                  </label>
                  <button onClick={() => { setInputs(DEFAULT_INPUTS); setFactors(DEFAULT_FACTORS) }} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Reset</button>
                </div>
                <p className="mt-3 text-xs text-white/60">
                  Educational approximations. For procurement or claims, commission an ISO-compliant study with primary data.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer callout */}
        <section className="border-t border-white/10 bg-black/30">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center lg:px-6">
            <h4 className="text-xl font-semibold">Want this wired into HEMPIN Orders & Admin?</h4>
            <p className="mx-auto mt-2 max-w-2xl text-white/75">We can persist projects, attach results to submissions, and surface signals in the marketplace.</p>
          </div>
        </section>
      </main>
    </>
  )
}

/* ---------- UI bits ---------- */

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-3 text-lg font-semibold">{title}</div>
      {children}
    </div>
  )
}

function Stepper({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const steps = ['Scope','Cultivation','Processing','Logistics','End-of-life']
  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[36rem] items-center gap-3">
        {steps.map((s, i) => {
          const active = i === step
          const done = i < step
          return (
            <li key={s} className="flex items-center">
              <button
                onClick={() => setStep(i)}
                className={[
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                  active ? 'bg-white text-black' : 'bg-white/10 text-white/80 hover:bg-white/20',
                ].join(' ')}
              >
                <span className={[
                  'grid h-6 w-6 place-items-center rounded',
                  done ? 'bg-emerald-500 text-black' : active ? 'bg-black text-white' : 'bg-white/10 text-white/70'
                ].join(' ')}>{done ? '✓' : i + 1}</span>
                <span>{s}</span>
              </button>
              {i < steps.length - 1 && <span className="mx-2 h-px w-8 bg-white/15" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-white/80">{label}</div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none ring-white/20 placeholder:text-white/40 focus:ring-2"
        placeholder="Type…"
      />
    </label>
  )
}

function InputNumber({ label, value, onChange, min, max, step = 0.01 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-sm text-white/80">
        <span>{label}</span>
        <span className="text-xs text-white/50">{Number.isFinite(value) ? value : '-'}</span>
      </div>
      <input
        type="number"
        value={value}
        min={min ?? undefined}
        max={max ?? undefined}
        step={step}
        onChange={e => onChange(clamp(parseFloat(e.target.value || '0'), min ?? -Infinity, max ?? Infinity))}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none ring-white/20 focus:ring-2"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-white/80">{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 outline-none ring-white/20 focus:ring-2"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="text-white/70">{fmtKg(value)} • {pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}