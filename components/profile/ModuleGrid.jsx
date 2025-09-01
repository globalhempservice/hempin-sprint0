export default function ModuleGrid({ modules, onToggle }) {
    const Cell = ({ m }) => (
      <button
        onClick={() => onToggle(m.key)}
        className={`group relative rounded-2xl border p-4 text-left transition
                    ${m.enabled ? 'border-white/25 bg-white/5' : 'border-white/10 bg-transparent hover:bg-white/5'}`}
        aria-pressed={m.enabled}
      >
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">{m.label}</div>
          <div className={`h-5 w-10 rounded-full border transition
                          ${m.enabled ? 'bg-[var(--success)]/30 border-[var(--success)]/60' : 'bg-white/5 border-white/15'}`}>
            <div className={`h-5 w-5 rounded-full bg-white/90 transition-transform
                            ${m.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>
        <div className="mt-2 text-sm text-[var(--text-2)]">
          {m.enabled ? 'Enabled • Enter →' : 'Disabled • Tap to enable'}
        </div>
        {/* door shimmer */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition" style={{
          background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.06) 40%, transparent 80%)'
        }} />
      </button>
    );
  
    return (
      <div>
        <h3 className="mb-3 font-semibold">Your Universes</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(m => <Cell key={m.key} m={m} />)}
        </div>
        <p className="mt-2 text-xs text-[var(--text-2)]">Toggling will soon save to your account entitlements.</p>
      </div>
    );
  }