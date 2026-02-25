import { useEffect, useRef } from 'react';

export type GalaxyState = {
  arms: number;
  stars: number;
  speed: number;
  opacity: number;
  tiltDeg: number;
  ellipticity: number;
  seed: number;
  meteors: boolean;
  hue: number;
  coreGlow: number;
  nebulaIntensity: number;
  reverseDir: boolean;
  trails: boolean;
  blackHole: boolean;
  pulse: boolean;
  colorDrift: boolean;
  novaRate: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  state: GalaxyState;
  setState: (next: Partial<GalaxyState>) => void;
  onRandomize: () => void;
  onReset: () => void;
  onSupernova: () => void;
  onWarp: () => void;
};

const PRESETS: { name: string; s: Partial<GalaxyState> }[] = [
  { name: 'Calm',       s: { speed: 0.05, opacity: 0.42, stars: 900,  arms: 4, tiltDeg: 10, ellipticity: 0.75, hue: 0,   coreGlow: 1.0, nebulaIntensity: 1.0, reverseDir: false, trails: false, blackHole: false, pulse: false, colorDrift: false, novaRate: 0 } },
  { name: 'Hemp Field', s: { speed: 0.07, opacity: 0.50, stars: 1200, arms: 4, tiltDeg: 15, ellipticity: 0.72, hue: 90,  coreGlow: 1.2, nebulaIntensity: 1.8, reverseDir: false, trails: false, blackHole: false, pulse: true,  colorDrift: false, novaRate: 0 } },
  { name: 'Fire',       s: { speed: 0.14, opacity: 0.54, stars: 1400, arms: 5, tiltDeg: 8,  ellipticity: 0.65, hue: 20,  coreGlow: 1.8, nebulaIntensity: 1.2, reverseDir: false, trails: true,  blackHole: false, pulse: false, colorDrift: false, novaRate: 3 } },
  { name: 'Nebula',     s: { speed: 0.04, opacity: 0.55, stars: 800,  arms: 3, tiltDeg: 12, ellipticity: 0.78, hue: 280, coreGlow: 2.0, nebulaIntensity: 2.2, reverseDir: false, trails: false, blackHole: false, pulse: true,  colorDrift: true,  novaRate: 0 } },
  { name: 'Black Eye',  s: { speed: 0.06, opacity: 0.48, stars: 1100, arms: 4, tiltDeg: 18, ellipticity: 0.70, hue: 240, coreGlow: 2.5, nebulaIntensity: 1.8, reverseDir: false, trails: false, blackHole: true,  pulse: false, colorDrift: false, novaRate: 0 } },
  { name: 'Drift',      s: { speed: 0.08, opacity: 0.50, stars: 1500, arms: 6, tiltDeg: 5,  ellipticity: 0.80, hue: 0,   coreGlow: 1.0, nebulaIntensity: 1.5, reverseDir: false, trails: true,  blackHole: false, pulse: true,  colorDrift: true,  novaRate: 0 } },
];

export default function GalaxyControls({
  open, onClose, state, setState, onRandomize, onReset, onSupernova, onWarp,
}: Props) {
  const panelRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); closeRef.current?.focus(); }
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>(
      'button.hud-toggle, input.hud-fader, button.hud-chip, button.hud-btn'
    );
    first?.focus();
  }, [open]);

  const uid = (s: string) => `gal-${s}`;

  const fader = (
    label: string,
    min: number,
    max: number,
    step: number,
    key: keyof GalaxyState,
    unit?: string,
  ) => {
    const readoutId = uid(`${String(key)}-val`);
    const val = state[key] as number;
    const isHue = key === 'hue';
    return (
      <label className="hud-row" htmlFor={uid(String(key))}>
        <span className="hud-label">{label}</span>
        <input
          id={uid(String(key))}
          aria-label={label}
          className="hud-fader"
          type="range"
          min={min} max={max} step={step}
          value={val}
          style={isHue ? { '--hue-val': val } as any : undefined}
          onChange={(e) => setState({ [key]: Number(e.target.value) } as any)}
        />
        <output id={readoutId} className="hud-readout" aria-live="polite">
          {isHue && (
            <span className="hud-swatch" style={{ background: `hsl(${val},80%,60%)` }} />
          )}
          {unit ? `${val}${unit}` : val}
        </output>
      </label>
    );
  };

  const toggle = (label: string, key: keyof GalaxyState) => (
    <button
      type="button"
      className={`hud-toggle ${state[key] ? 'on' : ''}`}
      onClick={() => setState({ [key]: !state[key] } as any)}
      aria-pressed={!!state[key]}
      aria-label={label}
    >
      <span className="dot" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <aside
        ref={panelRef as any}
        className={`hud-panel ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={uid('title')}
      >
        <div className="hud-head">
          <span id={uid('title')} className="hud-title">Galaxy controls</span>
          <button ref={closeRef} type="button" className="hud-x" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Feel</div>
          {fader('Speed',   0,   0.22, 0.005, 'speed')}
          {fader('Opacity', 0.2, 0.7,  0.01,  'opacity')}
          {toggle('Meteor shower', 'meteors')}
          {toggle('Reverse spin',  'reverseDir')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Color</div>
          {fader('Hue',    0,   360, 1,    'hue')}
          {fader('Core',   0.3, 2.5, 0.05, 'coreGlow')}
          {fader('Nebula', 0,   2.5, 0.05, 'nebulaIntensity')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Shape</div>
          {fader('Arms',        2,   6,    1,    'arms')}
          {fader('Tilt',       -30,  30,   1,    'tiltDeg', '\u00b0')}
          {fader('Ellipticity', 0.4, 0.95, 0.01, 'ellipticity')}
          {fader('Stars',       400, 2000, 50,   'stars')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Cosmos FX</div>
          {toggle('Star trails',  'trails')}
          {toggle('Black hole',   'blackHole')}
          {toggle('Pulse core',   'pulse')}
          {toggle('Color drift',  'colorDrift')}
          {fader('Auto-nova', 0, 6, 1, 'novaRate', '/min')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Events</div>
          <div className="hud-event-btns">
            <button type="button" className="hud-btn supernova" onClick={onSupernova}>
              Supernova!
            </button>
            <button type="button" className="hud-btn warp" onClick={onWarp}>
              Warp!
            </button>
          </div>
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Presets</div>
          <div className="hud-chips">
            {PRESETS.map((p) => (
              <button key={p.name} type="button" className="hud-chip" onClick={() => setState(p.s)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="hud-actions">
          <button type="button" className="hud-btn ghost" onClick={onReset}>Reset</button>
          <button type="button" className="hud-btn" onClick={onRandomize}>Randomize</button>
        </div>
      </aside>
    </>
  );
}
