// pages/experiments/coupons.tsx
import { useState } from 'react'

type Coupon = {
  code: string
  type: 'percent' | 'fixed'
  value: number
  desc: string
  active: boolean
}

export default function CouponsExperiment() {
  const [list, setList] = useState<Coupon[]>([])
  const [form, setForm] = useState<Coupon>({
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    desc: '10% off first purchase',
    active: true,
  })

  const addCoupon = () => {
    setList([...list, { ...form }])
    setForm({ ...form, code: '', desc: '' })
  }

  const toggle = (i: number) => {
    setList(list.map((c, j) => j === i ? { ...c, active: !c.active } : c))
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Coupon Concept Demo</h1>
      <p className="text-zinc-400">
        Create coupons, preview their look &amp; feel. (No backend, just demo state)
      </p>

      {/* Form */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="font-semibold mb-2">New Coupon</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <div className="text-xs text-zinc-400 mb-1">Code</div>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </label>
          <label>
            <div className="text-xs text-zinc-400 mb-1">Type</div>
            <select
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as Coupon['type'] })}
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </label>
          <label>
            <div className="text-xs text-zinc-400 mb-1">Value</div>
            <input
              type="number"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              value={form.value}
              onChange={e => setForm({ ...form, value: Number(e.target.value) })}
            />
          </label>
          <label>
            <div className="text-xs text-zinc-400 mb-1">Description</div>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
            />
          </label>
        </div>
        <button
          onClick={addCoupon}
          className="mt-4 rounded-lg border border-emerald-400/30 px-4 py-2 text-emerald-300 hover:bg-emerald-400/10"
        >
          Add coupon
        </button>
      </section>

      {/* Preview */}
      <section>
        <h2 className="font-semibold mb-4">Coupons List</h2>
        {list.length === 0 && (
          <p className="text-zinc-500">No coupons yet. Create one above.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((c, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${c.active ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-zinc-700 bg-zinc-900/40'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold tracking-wide">{c.code}</h3>
                <button
                  onClick={() => toggle(i)}
                  className="text-xs rounded-lg border border-white/10 px-2 py-1 text-zinc-400 hover:bg-white/5"
                >
                  {c.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <p className="text-sm text-zinc-400">{c.desc}</p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                {c.type === 'percent' ? `${c.value}% OFF` : `-$${c.value}`}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}