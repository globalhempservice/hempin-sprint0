import { useEffect } from 'react';

export type GalaxyState = {
  arms: number;
  stars: number;
  speed: number;
  opacity: number;
  tiltDeg: number;
  ellipticity: number;
  seed: number;
  meteors: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  state: GalaxyState;
  setState: (next: Partial<GalaxyState>) => void;
  onRandomize: () => void;
  onReset: () => void;
};

export default function GalaxyControls({
  open, onClose, state, setState, onRandomize, onReset
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fader = (label: string, min: number, max: number, step: number, key: keyof GalaxyState) => (
    <label className="hud-row">
      <span className="hud-label">{label}</span>
      <input
        aria-label={label}
        className="hud-fader"
        type="range"
        min={min}
        max={max}
        step={step}
        value={(state[key] as number)}
        onChange={(e) => setState({ [key]: Number(e.target.value) } as any)}
      />
    </label>
  );

  const toggle = (label: string, key: keyof GalaxyState) => (
    <button
      className={`hud-toggle ${state[key] ? 'on' : ''}`}
      onClick={() => setState({ [key]: !state[key] } as any)}
      aria-pressed={!!state[key]}
      aria-label={label}
    >
      <span className="dot" />
      <span>{label}</span>
    </button>
  );

  const presetBtn = (name: string, next: Partial<GalaxyState>) => (
    <button className="hud-chip" onClick={() => setState(next)}>
      {name}
    </button>
  );

  return (
    <>
      {open && <div className="hud-backdrop" onClick={onClose} aria-hidden />}
      <aside
        className={`hud-panel ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Galaxy controls"
      >
        <div className="hud-head">
          <span className="hud-title">Galaxy controls</span>
          <button className="hud-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Feel</div>
          {fader('Speed',       0,    0.2,  0.005, 'speed')}
          {fader('Opacity',     0.2,  0.7,  0.01,  'opacity')}
          {toggle('Meteor shower', 'meteors')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Shape</div>
          {fader('Arms',        2,    6,    1,     'arms')}
          {fader('Tilt',       -30,  30,    1,     'tiltDeg')}
          {fader('Ellipticity', 0.55, 0.9,  0.01,  'ellipticity')}
          {fader('Stars',       600,  2000, 50,    'stars')}
        </div>

        <div className="hud-group">
          <div className="hud-group-title">Presets</div>
          <div className="hud-chips">
            {presetBtn('Calm',     { speed: 0.05, opacity: 0.42, stars: 900,  arms: 4, tiltDeg: 10, ellipticity: 0.75 })}
            {presetBtn('Vivid',    { speed: 0.12, opacity: 0.58, stars: 1400, arms: 4, tiltDeg: 18, ellipticity: 0.7 })}
            {presetBtn('Pinwheel', { speed: 0.08, opacity: 0.5,  stars: 1200, arms: 3, tiltDeg: 0,  ellipticity: 0.85 })}
            {presetBtn('Elliptic', { speed: 0.06, opacity: 0.46, stars: 1100, arms: 2, tiltDeg: 24, ellipticity: 0.6 })}
          </div>
        </div>

        <div className="hud-actions">
          <button className="hud-btn ghost" onClick={onReset}>Reset</button>
          <button className="hud-btn" onClick={onRandomize}>Randomize</button>
        </div>
      </aside>
    </>
  );
}