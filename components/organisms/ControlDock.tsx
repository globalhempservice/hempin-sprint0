// components/organisms/ControlDock.tsx
import { useArchitect } from '@/stores/architect';

export default function ControlDock() {
  const { config, setConfig, reset } = useArchitect();

  return (
    <aside
      className="
        w-80 shrink-0 border-r border-white/10 bg-black/30
        backdrop-blur-md text-[13px] leading-5
        flex flex-col
      "
      aria-label="Architect Controls"
    >
      {/* Sticky header stays above floating page buttons */}
      <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight text-white">     </h2>
      </div>

      {/* Scrollable content area */}
      <div
        className="
          grow min-h-0 overflow-y-auto
          p-4 space-y-6
        "
        // make sure the last controls aren’t hidden behind the floating “Hide panel” button on mobile
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
      >
        {/* Canvas size */}
        <Section title="Canvas size">
          <SliderRow
            value={config.size}
            min={560}
            max={980}
            onChange={(v) => setConfig({ size: v })}
            suffix="px"
          />
        </Section>

        {/* Radii */}
        <Section title="Radii (orbit 1 / 2 / 3)">
          {([1, 2, 3] as const).map((k) => (
            <SliderRow
              key={k}
              label={`${k}`}
              value={config.radii[k]}
              min={80}
              max={Math.round(config.size / 2 - 40)}
              onChange={(v) => setConfig({ radii: { ...config.radii, [k]: v } })}
            />
          ))}
        </Section>

        {/* Speeds */}
        <Section title="Speeds (seconds per orbit)">
          {([1, 2, 3] as const).map((k) => (
            <SliderRow
              key={k}
              label={`${k}`}
              value={config.speeds[k]}
              min={20}
              max={200}
              onChange={(v) => setConfig({ speeds: { ...config.speeds, [k]: v } })}
            />
          ))}
        </Section>

        {/* Tilt */}
        <Section title="Tilt (3D perspective)">
          <SliderRow
            value={config.tiltDeg}
            min={0}
            max={25}
            onChange={(v) => setConfig({ tiltDeg: v })}
            suffix="°"
          />
        </Section>

        {/* Orbits visibility — compact 2-col */}
        <Section title="Show orbits">
          <div className="grid grid-cols-2 gap-2">
            {([1, 2, 3] as const).map((k) => (
              <ToggleRow
                key={k}
                checked={config.show.orbits[k]}
                label={`Orbit ${k}`}
                onChange={(checked) =>
                  setConfig({
                    show: {
                      ...config.show,
                      orbits: { ...config.show.orbits, [k]: checked },
                    },
                  })
                }
              />
            ))}
          </div>
        </Section>

        {/* General show toggles — compact 2-col */}
        <Section title="Show elements">
          <div className="grid grid-cols-2 gap-2">
            {(['nebula', 'rings', 'labels', 'moons', 'tooltips'] as const).map((key) => (
              <ToggleRow
                key={key}
                checked={config.show[key]}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                onChange={(checked) =>
                  setConfig({ show: { ...config.show, [key]: checked } })
                }
              />
            ))}
          </div>
        </Section>

        <div className="pt-1">
          <button
            onClick={reset}
            className="
              w-full rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm
              hover:bg-white/15 transition
            "
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── UI bits ─────────────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="text-[11px] uppercase tracking-wide opacity-60">{title}</div>
      {children}
      <div className="h-px bg-white/10 mt-3" />
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="w-5 text-xs opacity-60">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lime-400/90 h-1.5"
      />
      <span className="text-xs opacity-70 tabular-nums">
        {value}
        {suffix}
      </span>
    </div>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-lime-400/90"
      />
      <span className="text-[13px] leading-5">{label}</span>
    </label>
  );
}