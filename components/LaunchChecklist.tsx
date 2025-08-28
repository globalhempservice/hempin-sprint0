// components/LaunchChecklist.tsx
type Item = { label: string; done: boolean; href?: string }

export function LaunchChecklist({ items }: { items: Item[] }) {
  const completed = items.filter(i => i.done).length
  const total = items.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your launch checklist</h2>
        <span className="text-sm text-neutral-400">{completed}/{total} complete</span>
      </div>
      <div className="h-2 rounded bg-neutral-800 overflow-hidden mb-4">
        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${it.done ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
              <span>{it.label}</span>
            </div>
            {it.href && (
              <a href={it.href} className="text-emerald-400 hover:underline text-sm">Open</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}