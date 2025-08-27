
type Step = {
  id: number
  title: string
  current: boolean
  completed: boolean
}
export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
            ${s.completed ? 'bg-green-500 text-white' : s.current ? 'bg-white/10 border border-white/20' : 'bg-white/5 border border-white/10'}`}>
            {s.completed ? '✓' : s.id}
          </span>
          <span className={`text-sm ${s.current ? 'font-semibold' : 'opacity-80'}`}>{s.title}</span>
          {i < steps.length - 1 && <span className="mx-2 opacity-40">›</span>}
        </li>
      ))}
    </ol>
  )
}
