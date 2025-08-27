// components/AccountProgress.tsx
export default function AccountProgress({ items }: { items: { label: string; done: boolean; href?: string }[] }) {
  const total = items.length
  const completed = items.filter(i => i.done).length
  const pct = Math.round((completed / Math.max(1,total)) * 100)

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your launch checklist</h3>
        <div className="text-sm text-zinc-400">{completed}/{total} complete</div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded bg-zinc-800">
        <div className="h-full bg-emerald-500" style={{ width: pct + '%' }} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={"inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] " + (i.done ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400")}>
                {i.done ? "✓" : "•"}
              </span>
              <span className={i.done ? "text-zinc-300" : "text-zinc-400"}>{i.label}</span>
            </div>
            {i.href && (
              <a href={i.href} className="text-xs text-emerald-300 hover:text-emerald-200">Open</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
