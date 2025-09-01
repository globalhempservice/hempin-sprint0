export default function BadgeShelf({ badges }) {
    return (
      <div>
        <h3 className="mb-3 font-semibold">Badges</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {badges.map(b => (
            <div
              key={b.code}
              className={`shrink-0 flex items-center gap-2 rounded-xl border px-3 py-2
                          ${b.earned ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent opacity-60'}`}
              aria-label={b.name}
              title={b.name}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
              <span className="text-sm">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }