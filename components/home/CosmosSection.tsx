import { useEffect, useMemo, useState } from 'react';
import Galaxy from '@/components/home/Galaxy';
import GalaxyControls, { GalaxyState } from '@/components/home/GalaxyControls';

const DEFAULTS: GalaxyState = {
  arms: 4,
  stars: 1500,
  speed: 0.08,
  opacity: 0.52,
  seed: 20241024,
  tiltDeg: 22,
  ellipticity: 0.68,
  meteors: true,
};

const PLANETS = [
  { title: 'Market',    text: 'Discover hemp products and materials across industries.' },
  { title: 'Fund',      text: 'Back regenerative projects, campaigns, and infrastructure.' },
  { title: 'Knowledge', text: 'Access science, craft, and shared cultural intelligence.' },
  { title: 'Place',     text: 'Explore maps of farms, showrooms, labs, and venues.' },
  { title: 'Event',     text: 'Join expos, festivals, and gatherings worldwide.' },
  { title: 'Directory', text: 'Find the actors: brands, innovators, farmers, researchers.' },
] as const;

export default function CosmosSection() {
  // desktop/tablet gate for controls
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // full-viewport sizing for galaxy so it never hides under section edges
  const [galaxySize, setGalaxySize] = useState(820);
  useEffect(() => {
    const calc = () => {
      const s = Math.min(window.innerWidth, window.innerHeight) * 0.8; // larger than before
      setGalaxySize(Math.round(Math.max(560, Math.min(s, 1100))));
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, []);

  // galaxy state (persisted)
  const [openPanel, setOpenPanel] = useState(false);
  const [gs, setGs] = useState<GalaxyState>(() => {
    try {
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  const setState = (next: Partial<GalaxyState>) =>
    setGs(prev => {
      const v = { ...prev, ...next };
      try { localStorage.setItem('hempin.galaxy', JSON.stringify(v)); } catch {}
      return v;
    });

  const galaxyProps = useMemo(() => ({
    size: galaxySize,
    arms: gs.arms,
    stars: gs.stars,
    speed: gs.speed,
    opacity: gs.opacity,
    seed: gs.seed,
    tiltDeg: gs.tiltDeg,
    ellipticity: gs.ellipticity,
    meteors: gs.meteors,
  }), [galaxySize, gs]);

  // accordion state
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* Easter-egg satellite (desktop only) */}
      {isDesktop && (
        <button
          className="hud-fab hud-fab--cosmos"
          aria-label="Tweak galaxy"
          onClick={() => setOpenPanel(true)}
        >
          <span className="satellite" />
        </button>
      )}

      {/* Centered background galaxy */}
      <div className="galaxy-layer">
        <Galaxy {...galaxyProps} />
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

        {/* Vertical, centered accordion */}
        <div className="cosmos-accordion">
          {PLANETS.map(({ title, text }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={title} className={`card planet ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen}>
                <button className="planet-summary" onClick={() => toggle(i)}>
                  <span className="planet-title">{title}</span>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M12 15.5l-6-6h12l-6 6z" />
                  </svg>
                </button>
                <div className="planet-content">
                  <p>{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer (desktop only) */}
      {isDesktop && (
        <GalaxyControls
          open={openPanel}
          onClose={() => setOpenPanel(false)}
          state={gs}
          setState={setState}
          onRandomize={() => setState({ seed: Math.floor(Math.random() * 1e9) })}
          onReset={() => setState(DEFAULTS)}
        />
      )}
    </section>
  );
}