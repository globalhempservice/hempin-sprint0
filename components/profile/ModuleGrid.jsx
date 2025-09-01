import { useRouter } from 'next/router';

// Map to your /colorpalette choices (tweak hexes to match your sheet exactly)
const MODULE_PALETTE = {
  farm:    { edge: '#38E2B5', glow: 'rgba(56,226,181,0.18)' },     // teal-mint
  factory: { edge: '#6B5CF6', glow: 'rgba(107,92,246,0.18)' },     // indigo-violet
  brand:   { edge: '#C9A66B', glow: 'rgba(201,166,107,0.18)' },    // gold
  research:{ edge: '#7AD1FF', glow: 'rgba(122,209,255,0.18)' },    // sky
  events:  { edge: '#FF8A5B', glow: 'rgba(255,138,91,0.18)' }      // coral
};

export default function ModuleGrid({ modules, onToggle }) {
  const router = useRouter();
  const mods = Array.isArray(modules) ? modules : [];

  const enterUniverse = (key, enabled) => {
    if (!enabled) return;
    // TODO: wire destination when ready:
    // router.push(`/modules/${key}`) or `/account/${key}`
  };

  const Cell = ({ m }) => {
    const palette = MODULE_PALETTE[m.key] || { edge: '#ffffff', glow: 'rgba(255,255,255,0.12)' };
    const enabled = !!m.enabled;

    return (
      <div
        className={`group relative rounded-2xl border p-4 text-left transition overflow-hidden`}
        style={{
          borderColor: enabled ? palette.edge : 'rgba(255,255,255,0.10)',
          background: enabled ? `linear-gradient(135deg, ${palette.glow} 0%, transparent 70%)` : 'transparent'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">{m.label}</div>
          {/* Toggle */}
          <button
            onClick={() => onToggle?.(m.key)}
            className={`h-5 w-10 rounded-full border transition outline-none focus:ring-2 focus:ring-white/30`}
            style={{
              backgroundColor: enabled ? palette.glow : 'rgba(255,255,255,0.05)',
              borderColor: enabled ? palette.edge : 'rgba(255,255,255,0.15)'
            }}
            aria-pressed={enabled}
            aria-label={`Toggle ${m.label}`}
          >
            <div
              className="h-5 w-5 rounded-full bg-white/90 transition-transform"
              style={{ transform: enabled ? 'translateX(20px)' : 'translateX(0px)' }}
            />
          </button>
        </div>

        <div className="mt-2 text-sm text-[var(--text-2)]">
          {enabled ? 'Enabled • You can enter this universe' : 'Disabled • Tap to enable'}
        </div>

        {/* Enter button becomes obvious when enabled */}
        <div className="mt-3">
          <button
            onClick={() => enterUniverse(m.key, enabled)}
            disabled={!enabled}
            className={`px-3 py-2 rounded-lg border text-sm transition
              ${enabled
                ? 'cursor-pointer'
                : 'opacity-50 cursor-not-allowed'}
            `}
            style={{
              borderColor: enabled ? palette.edge : 'rgba(255,255,255,0.15)',
              color: enabled ? palette.edge : 'var(--text-2)',
              background: enabled ? 'rgba(255,255,255,0.04)' : 'transparent'
            }}
          >
            {enabled ? 'Enter →' : 'Enable to enter'}
          </button>
        </div>

        {/* subtle shimmer on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition"
          style={{ background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.06) 40%, transparent 80%)' }}
        />
      </div>
    );
  };

  return (
    <div>
      <h3 className="mb-3 font-semibold">Your Universes</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mods.map(m => <Cell key={m.key} m={m} />)}
      </div>
      <p className="mt-2 text-xs text-[var(--text-2)]">Toggling saves to your account entitlements.</p>
    </div>
  );
}