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

export default function CosmosSection() {
  // responsive: only show controls on tablet/desktop
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener?.('change', set);
    return () => mq.removeEventListener?.('change', set);
  }, []);

  // responsive galaxy size so it stays visible & centered
  const [galaxySize, setGalaxySize] = useState<number>(820);
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // occupy up to ~70% of the shorter side; clamp for big screens
      const s = Math.min(Math.max(Math.min(vw, vh) * 0.7, 560), 980);
      setGalaxySize(Math.round(s));
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, []);

  const [open, setOpen] = useState(false);
  const [gs, setGs] = useState<GalaxyState>(() => {
    try {
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const setState = (next: Partial<GalaxyState>) => {
    setGs(prev => {
      const v = { ...prev, ...next };
      try { localStorage.setItem('hempin.galaxy', JSON.stringify(v)); } catch {}
      return v;
    });
  };

  const randomize = () => setState({ seed: Math.floor(Math.random() * 1e9) });
  const reset = () => setState(DEFAULTS);

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

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* Satellite FAB — tablet/desktop only */}
      {isDesktop && (
        <button
          className="hud-fab"
          aria-label="Tweak galaxy"
          onClick={() => setOpen(true)}
        >
          <span className="satellite" />
        </button>
      )}

      {/* Background galaxy layer */}
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

        <div className="cards mt-10 cosmos-cards">
          {[
            { title: 'Market',    text: 'Discover hemp products and materials across industries.' },
            { title: 'Fund',      text: 'Back regenerative projects, campaigns, and infrastructure.' },
            { title: 'Knowledge', text: 'Access science, craft, and shared cultural intelligence.' },
            { title: 'Place',     text: 'Explore maps of farms, showrooms, labs, and venues.' },
            { title: 'Event',     text: 'Join expos, festivals, and gatherings worldwide.' },
            { title: 'Directory', text: 'Find the actors: brands, innovators, farmers, researchers.' },
          ].map(({ title, text }) => (
            <details key={title} className="card planet">
              <summary>
                <h3>{title}</h3>
                <span className="caret" aria-hidden />
              </summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Controls panel — tablet/desktop only */}
      {isDesktop && (
        <GalaxyControls
          open={open}
          onClose={() => setOpen(false)}
          state={gs}
          setState={setState}
          onRandomize={randomize}
          onReset={reset}
        />
      )}
    </section>
  );
}