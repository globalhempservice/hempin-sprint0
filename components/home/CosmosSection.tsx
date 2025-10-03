import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import GalaxyControls, { GalaxyState } from '@/components/home/GalaxyControls';

// ⬇️ Load Galaxy only when we render it (saves mobile bundle/CPU)
const Galaxy = dynamic(() => import('@/components/home/Galaxy'), { ssr: false });

const DEFAULTS: GalaxyState = {
  arms: 4,
  stars: 1500,
  speed: 0.08,
  opacity: 0.42,
  seed: 20241024,
  tiltDeg: 22,
  ellipticity: 0.68,
  meteors: true,
};

type PlanetItem = {
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  link: string;
};

const PLANETS: PlanetItem[] = [
  /* … your PLANETS array unchanged … */
] as const;

export default function CosmosSection() {
  // desktop gate
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // respect reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // only enable galaxy on desktop & when motion is OK
  const enableGalaxy = isDesktop && !reducedMotion;

  // galaxy sizing (used only when enabled)
  const [galaxySize, setGalaxySize] = useState(820);
  useEffect(() => {
    if (!enableGalaxy) return;
    const calc = () => {
      const s = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      setGalaxySize(Math.round(Math.max(560, Math.min(s, 1100))));
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, [enableGalaxy]);

  // galaxy state (persist)
  const [openPanel, setOpenPanel] = useState(false);
  const [gs, setGs] = useState<GalaxyState>(() => {
    try {
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const setState = (next: Partial<GalaxyState>) =>
    setGs(prev => {
      const v = { ...prev, ...next };
      try { localStorage.setItem('hempin.galaxy', JSON.stringify(v)); } catch {}
      return v;
    });

  const galaxyProps = useMemo(
    () => ({
      size: galaxySize,
      arms: gs.arms,
      stars: gs.stars,
      speed: gs.speed,
      opacity: gs.opacity,
      seed: gs.seed,
      tiltDeg: gs.tiltDeg,
      ellipticity: gs.ellipticity,
      meteors: gs.meteors,
    }),
    [galaxySize, gs]
  );

  // accordion
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* FAB only on desktop */}
      {enableGalaxy && (
        <button
          className="hud-fab hud-fab--cosmos"
          aria-label="Tweak galaxy"
          onClick={() => setOpenPanel(true)}
        >
          <span className="satellite" />
        </button>
      )}

      {/* Galaxy background (desktop only) or a light fallback on mobile */}
      <div className={`galaxy-layer ${enableGalaxy ? '' : 'galaxy-fallback'}`}>
        {enableGalaxy ? <Galaxy {...galaxyProps} /> : null}
      </div>

      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">The Hemp’in Cosmos</h2>

        <p className="muted max-w-2xl mx-auto mt-4">
          Like the night sky, the hemp universe is vast — but Hemp’in gives it shape.
          Galaxies emerge as living spheres of activity: places to trade, fund, learn,
          gather, and grow. Within them orbit planets — brands, farms, products, research —
          each with their own moons of reviews, games, and tools. Together, they form a
          navigable cosmos, alive with possibility.
        </p>

        {/* Compact-left accordion */}
        <div className="cosmos-accordion">
          {PLANETS.map(({ title, subtitle, bullets, cta, link }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={title} className={`card planet ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen}>
                <button className="planet-summary" onClick={() => toggle(i)}>
                  <span className="planet-title" aria-hidden={false}>{title}</span>
                  <span className="planet-subtitle muted">{subtitle}</span>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M12 15.5l-6-6h12l-6 6z" />
                  </svg>
                </button>

                <div className="planet-content">
                  <ul className="planet-bullets">
                    {bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                  <div className="planet-cta-row">
                    <a href={link} className="mini-btn" target="_blank" rel="noopener noreferrer">{cta}</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls drawer (desktop only) */}
      {enableGalaxy && (
        <GalaxyControls
          open={openPanel}
          onClose={() => setOpenPanel(false)}
          state={gs}
          setState={setState}
          onRandomize={() => setState({ seed: Math.floor(Math.random() * 1e9) })}
          onReset={() => setState(DEFAULTS)}
        />
      )}

      {/* a tiny CSS fallback so mobile still has a soft backdrop */}
      <style jsx>{`
        .galaxy-fallback {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(60% 50% at 50% 30%, rgba(66, 153, 225, 0.10), transparent 60%),
            radial-gradient(50% 40% at 70% 70%, rgba(110, 231, 183, 0.08), transparent 60%);
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}